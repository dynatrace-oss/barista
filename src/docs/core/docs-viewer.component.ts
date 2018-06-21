import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ComponentFactoryResolver,
  Injector,
  Inject,
  Type
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DtLogger, DtLoggerFactory } from '@dynatrace/angular-components';
import { Observable, of, timer } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DocumentContents } from './document.service';
import { EMBEDDED_COMPONENTS, COMPONENT_EXAMPLES } from '../ui/ui.module';

// Initialization prevents flicker once pre-rendering is on
const initialDocViewerElement = document.querySelector('docs-viewer');
const initialDocViewerContent = initialDocViewerElement ? initialDocViewerElement.innerHTML : '';
const LOG: DtLogger = DtLoggerFactory.create('DocsViewerComponent');

export const NO_ANIMATIONS = 'no-animations';

@Component({
  selector: 'docs-viewer',
  template: '',
})
export class DocsViewerComponent implements OnDestroy {
  static animationsEnabled = true;
  private hostElement: HTMLElement;
  private void$ = of<void>(undefined);
  private onDestroy$ = new EventEmitter<void>();
  private docContents$ = new EventEmitter<DocumentContents>();

  protected currViewContainer: HTMLElement = document.createElement('div');
  protected nextViewContainer: HTMLElement = document.createElement('div');

  @Input()
  set doc(newDoc: DocumentContents) {
    if (newDoc) {
      this.docContents$.emit(newDoc);
    }
  }
  @Output() docReady = new EventEmitter<void>();
  @Output() docRendered = new EventEmitter<void>();
  @Output() docInserted = new EventEmitter<void>();
  @Output() docRemoved = new EventEmitter<void>();
  constructor(
    // tslint:disable-next-line:no-any
    @Inject(EMBEDDED_COMPONENTS) private _embeddedComponents: Array<Type<any>>,
    // tslint:disable-next-line:no-any
    @Inject(COMPONENT_EXAMPLES) private _componentExamples: Array<Array<Type<any>>>,
    elementRef: ElementRef,
    private titleService: Title,
    private _resolver: ComponentFactoryResolver,
    private _injector: Injector
  ) {
    this.hostElement = elementRef.nativeElement;
    this.hostElement.innerHTML = initialDocViewerContent;

    if (this.hostElement.firstElementChild) {
      this.currViewContainer = this.hostElement.firstElementChild as HTMLElement;
    }

    this.docContents$
      .pipe(
        switchMap((newDoc) => this.render(newDoc)),
        takeUntil(this.onDestroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.emit();
  }

  protected render(doc: DocumentContents): Observable<void> {
    return this.void$.pipe(
      tap(() => this.nextViewContainer.innerHTML = doc.content || ''),
      tap(() => this.prepareTitle(doc.id)),
      switchMap(() => this.renderDemos()),
      tap(() => this.docReady.emit()),
      switchMap(() => this.swapViews()),
      tap(() => this.docRendered.emit()),
      catchError((err) => {
        const errorMessage = (err instanceof Error) ? err.stack : err;
        LOG.error(`Failed preparing document '${doc.id}':`, errorMessage);
        return this.void$;
      })
    );
  }

  protected renderDemos(): Promise<void> {
    // tslint:disable-next-line:no-any
    const examples: Array<Type<any>> = [];
    if (Array.isArray(this._componentExamples)) {
      this._componentExamples.forEach((components) => examples.push(...components));
    }
    this._embeddedComponents.forEach((comp) => {
      const factory = this._resolver.resolveComponentFactory(comp);
      const embeddedComponentElements = this.nextViewContainer.querySelectorAll('docs-source-example[example]');
      // tslint:disable-next-line:no-any
      for (const element of embeddedComponentElements as any as HTMLElement[]) {
        const name = element.getAttribute('example');
        const componentType = examples.find((example) => example.name === name);
        if (componentType) {

          const ref = factory.create(this._injector, [], element);
          ref.instance.componentType = componentType;
          ref.changeDetectorRef.detectChanges();
        }
      }
    });

    return Promise.resolve();
  }

  protected prepareTitle(id: string): void {
    this.titleService.setTitle(id ? `Dynatrace - ${id}` : 'Dynatrace');
  }

  protected swapViews(): Observable<void> {
    const raf$ = new Observable<void>((subscriber) => {
      const rafId = requestAnimationFrame(() => {
        subscriber.next();
        subscriber.complete();
      });
      return () => cancelAnimationFrame(rafId);
    });

    // Get the actual transition duration (taking global styles into account).
    // According to the [CSSOM spec](https://drafts.csswg.org/cssom/#serializing-css-values),
    // `time` values should be returned in seconds.
    const getActualDuration = (elem: HTMLElement) => {
      const cssValue = getComputedStyle(elem).transitionDuration || '';
      const seconds = Number(cssValue.replace(/s$/, ''));
      // tslint:disable-next-line:no-magic-numbers
      return seconds * 1000;
    };
    const animateProp =
      (elem: HTMLElement, prop: keyof CSSStyleDeclaration, from: string, to: string, duration = 200) => {
        const animationsDisabled = !DocsViewerComponent.animationsEnabled
          || this.hostElement.classList.contains(NO_ANIMATIONS);
        if (prop === 'length' || prop === 'parentRule') {
          // We cannot animate length or parentRule properties because they are readonly
          return this.void$;
        }
        elem.style.transition = '';
        return animationsDisabled
          ? this.void$.pipe(tap(() => elem.style[prop] = to))
          : this.void$.pipe(
            // In order to ensure that the `from` value will be applied immediately (i.e.
            // without transition) and that the `to` value will be affected by the
            // `transition` style, we need to ensure an animation frame has passed between
            // setting each style.
            switchMap(() => raf$), tap(() => elem.style[prop] = from),
            switchMap(() => raf$), tap(() => elem.style.transition = `all ${duration}ms ease-in-out`),
            // tslint:disable-next-line:no-any
            switchMap(() => raf$), tap(() => (elem.style as any)[prop] = to),
            switchMap(() => timer(getActualDuration(elem))), switchMap(() => this.void$)
          );
      };

    const animateLeave = (elem: HTMLElement) => animateProp(elem, 'opacity', '1', '0.1');
    const animateEnter = (elem: HTMLElement) => animateProp(elem, 'opacity', '0.1', '1');

    let done$ = this.void$;

    if (this.currViewContainer.parentElement) {
      done$ = done$.pipe(
        // Remove the current view from the viewer.
        switchMap(() => animateLeave(this.currViewContainer)),
        tap(() => this.currViewContainer.parentElement!.removeChild(this.currViewContainer)),
        tap(() => this.docRemoved.emit())
      );
    }

    return done$.pipe(
      // Insert the next view into the viewer.
      tap(() => this.hostElement.appendChild(this.nextViewContainer)),
      tap(() => this.docInserted.emit()),
      switchMap(() => animateEnter(this.nextViewContainer)),
      tap(() => {
        const prevViewContainer = this.currViewContainer;
        this.currViewContainer = this.nextViewContainer;
        this.nextViewContainer = prevViewContainer;
        this.nextViewContainer.innerHTML = '';  // Empty to release memory.
      })
    );
  }
}
