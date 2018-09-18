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
  Type,
  ViewContainerRef,
  ApplicationRef,
  Renderer2
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DtLogger, DtLoggerFactory } from '@dynatrace/angular-components';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DocumentContents } from './document.service';
import { EMBEDDED_COMPONENTS, COMPONENT_EXAMPLES } from '../ui/ui.module';
import { DomPortalHost, ComponentPortal } from '@angular/cdk/portal';

// Initialization prevents flicker once pre-rendering is on
const initialDocViewerElement = document.querySelector('docs-viewer');
const initialDocViewerContent = initialDocViewerElement ? initialDocViewerElement.innerHTML : '';
const LOG: DtLogger = DtLoggerFactory.create('DocsViewerComponent');

export const NO_ANIMATIONS = 'no-animations';
const exampleNotFoundTemplateFactory = (name: string) =>
  `<p class="example-error">Example <code>${name}</code> not found. <br>See console for more informations.`;

interface ExampleType<T> extends Type<T> {
  originalClassName: string;
}

@Component({
  selector: 'docs-viewer',
  template: '',
})
export class DocsViewerComponent implements OnDestroy {
  static animationsEnabled = true;
  private _hostElement: HTMLElement;
  private _void$ = of<void>(undefined);
  private _onDestroy$ = new EventEmitter<void>();
  private _docContents$ = new EventEmitter<DocumentContents>();
  private _portalHosts: DomPortalHost[] = [];

  protected currViewContainer: HTMLElement = this._renderer.createElement('div');
  protected nextViewContainer: HTMLElement = this._renderer.createElement('div');

  @Input()
  set doc(newDoc: DocumentContents) {
    if (newDoc) {
      this._docContents$.emit(newDoc);
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
    @Inject(COMPONENT_EXAMPLES) private _componentExamples: Array<Array<ExampleType<any>>>,
    elementRef: ElementRef,
    private titleService: Title,
    private _resolver: ComponentFactoryResolver,
    private _injector: Injector,
    private _viewContainerRef: ViewContainerRef,
    private _appRef: ApplicationRef,
    private _renderer: Renderer2
  ) {
    this._hostElement = elementRef.nativeElement;
    // tslint:disable-next-line:dt-ban-inner-html
    this._hostElement.innerHTML = initialDocViewerContent;

    if (this._hostElement.firstElementChild) {
      this.currViewContainer = this._hostElement.firstElementChild as HTMLElement;
    }

    this._docContents$
      .pipe(
        switchMap((newDoc) => this.render(newDoc)),
        takeUntil(this._onDestroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.clearDemos();
    this._onDestroy$.emit();
  }

  protected render(doc: DocumentContents): Observable<void> {
    return this._void$.pipe(
      // tslint:disable-next-line:dt-ban-inner-html
      tap(() => this.nextViewContainer.innerHTML = doc.content || ''),
      tap(() => { this.prepareTitle(doc.id); }),
      tap(() => { this.clearDemos(); }),
      switchMap(async () => this.renderDemos()),
      tap(() => { this.docReady.emit(); }),
      switchMap(() => this.swapViews()),
      tap(() => { this.docRendered.emit(); }),
      catchError((err) => {
        const errorMessage = (err instanceof Error) ? err.stack : err;
        LOG.error(`Failed preparing document '${doc.id}':`, errorMessage);
        return this._void$;
      })
    );
  }

  protected async renderDemos(): Promise<void> {
    // tslint:disable-next-line:no-any
    const examples: Array<ExampleType<any>> = [];
    if (Array.isArray(this._componentExamples)) {
      this._componentExamples.forEach((components) => examples.push(...components));
    }
    this._embeddedComponents.forEach((comp) => {
      const embeddedComponentElements = [].slice.call(this.nextViewContainer.querySelectorAll('docs-source-example[example]'));

      // tslint:disable-next-line:no-any
      for (const element of embeddedComponentElements as HTMLElement[]) {
        const name = element.getAttribute('example');
        const componentType = examples.find((example) => example.originalClassName === name);
        if (componentType) {
          const portalHost = new DomPortalHost(element, this._resolver, this._appRef, this._injector);
          const examplePortal = new ComponentPortal(comp, this._viewContainerRef);
          const ref = portalHost.attach(examplePortal);
          ref.instance.componentType = componentType;
          this._portalHosts.push(portalHost);
        } else {
          // tslint:disable-next-line:dt-ban-inner-html
          element.innerHTML = exampleNotFoundTemplateFactory(name!);

          // Console log here as we wanna know when an example has not been found
          // but we do not wanna break the app with throwing an error.
          // tslint:disable-next-line:no-console
          LOG.warn(`Example "${name}" not found. Did you add the @OriginalClassName('${name}') decorator to the class?`);
        }
      }
    });

    return Promise.resolve();
  }

  private clearDemos(): void {
    this._portalHosts.forEach((h) => { h.dispose(); });
    this._portalHosts = [];
  }

  protected prepareTitle(id: string): void {
    this.titleService.setTitle(id ? `Dynatrace - ${id}` : 'Dynatrace');
  }

  protected swapViews(): Observable<void> {
    let done$ = this._void$;

    if (this.currViewContainer.parentElement) {
      done$ = done$.pipe(
        // Remove the current view from the viewer.
        tap(() => this.currViewContainer.parentElement!.removeChild(this.currViewContainer)),
        tap(() => { this.docRemoved.emit(); })
      );
    }

    return done$.pipe(
      // Insert the next view into the viewer.
      tap(() => this._hostElement.appendChild(this.nextViewContainer)),
      tap(() => { this.docInserted.emit(); }),
      tap(() => {
        const prevViewContainer = this.currViewContainer;
        this.currViewContainer = this.nextViewContainer;
        this.nextViewContainer = prevViewContainer;
        // tslint:disable-next-line:dt-ban-inner-html
        this.nextViewContainer.innerHTML = '';  // Empty to release memory.
      })
    );
  }
}
