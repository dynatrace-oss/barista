import {
  ComponentPortal,
  DomPortalOutlet,
  TemplatePortal,
} from '@angular/cdk/portal';
import {
  AfterViewInit,
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  DoCheck,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { addCssClass } from '@dynatrace/angular-components/core';

import {
  DtSelectionAreaContainer,
  DtSelectionAreaContainerChange,
} from './selection-area-container';

/**
 * @deprecated The selection area will be replaced with the chart selection area
 * @breaking-change To be removed with 5.0.0.
 * Change event object emitted by DtSelectionArea
 */
// tslint:disable-next-line: deprecation
export interface DtSelectionAreaChange extends DtSelectionAreaContainerChange {
  // tslint:disable-next-line: deprecation
  source: DtSelectionArea;
}
/** The global container that holds all selection area containers */
let globalContainerElement: HTMLElement | null = null;

/**
 * @deprecated The selection area will be replaced with the chart selection area
 * @breaking-change To be removed with 5.0.0.
 */
@Component({
  selector: 'dt-selection-area',
  exportAs: 'dtSelectionArea',
  templateUrl: 'selection-area.html',
  host: {
    class: 'dt-selection-area',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtSelectionArea
  implements OnChanges, AfterViewInit, OnDestroy, DoCheck {
  /** The aria label used for the selected area of the selection area */
  @Input('aria-label-selected-area') ariaLabelSelectedArea: string;

  /** The aria label used for the left handle of the selection area */
  @Input('aria-label-left-handle') ariaLabelLeftHandle: string;

  /** The aria label used for the right handle of the selection area */
  @Input('aria-label-right-handle') ariaLabelRightHandle: string;

  /** The aria label used in the close button of the overlay */
  @Input('aria-label-close-button') ariaLabelClose: string;

  /** Emits when the selected area changes position or size */
  @Output() readonly changed: Observable<
    // tslint:disable-next-line: deprecation
    DtSelectionAreaChange
    // tslint:disable-next-line: deprecation
  > = this._deferContainerEvent<DtSelectionAreaContainerChange>('changed').pipe(
    map(changed => ({ source: this, ...changed })),
  );

  /** Emits when the selected area is closed */
  @Output() readonly closed: Observable<void> = this._deferContainerEvent<void>(
    'closed',
  );

  /** @internal Emits whenever the grabbing state changes */
  readonly _grabbingChange: Observable<boolean> = this._deferContainerEvent<
    boolean
  >('_grabbingChange');

  /** The portal outlet used to render the container to the body to properly position the selection area container */
  private _portalOutlet: DomPortalOutlet;

  /** The instance of the container that is dynamically generated in the outlet */
  // tslint:disable-next-line: deprecation
  private _containerInstance: DtSelectionAreaContainer;

  /**
   * @internal Emits every time the domrect of the origin changes
   * It is triggered in the origin since the selection area does not have a connection to the origin itself
   * This needs to be run after zone is stable because we need to wait until the origin is actually rendered
   * to get the correct boundaries
   */
  _boundariesChanged: BehaviorSubject<ClientRect | null> = new BehaviorSubject(
    null,
  );

  /** @internal Reference to the overlay content template. */
  @ViewChild('content', { read: TemplateRef, static: true })
  _overlayContent: TemplateRef<void>;

  /** @internal Reference to the overlay actions template. */
  @ViewChild('actions', { read: TemplateRef, static: true })
  _overlayActions: TemplateRef<void>;

  constructor(
    private _renderer: Renderer2,
    private _viewContainerRef: ViewContainerRef,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    private _ngZone: NgZone,
  ) {
    const containerInstance = this._createContainer();
    if (containerInstance) {
      this._containerInstance = containerInstance;
      this._boundariesChanged.subscribe(boundaries => {
        if (boundaries) {
          this._applyBoundariesToContainer(boundaries);
        }
      });
    }
  }

  ngAfterViewInit(): void {
    if (this._containerInstance) {
      this._containerInstance._overlayContentPortal = new TemplatePortal(
        this._overlayContent,
        this._viewContainerRef,
      );
      this._containerInstance._overlayActionsPortal = new TemplatePortal(
        this._overlayActions,
        this._viewContainerRef,
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes &&
      this._containerInstance &&
      (changes.ariaLabelSelectedArea ||
        changes.ariaLabelLeftHandle ||
        changes.ariaLabelRightHandle ||
        changes.ariaLabelClose)
    ) {
      this._containerInstance._updateAriaLabels(
        this.ariaLabelSelectedArea,
        this.ariaLabelLeftHandle,
        this.ariaLabelRightHandle,
        this.ariaLabelClose,
      );
    }
  }

  ngDoCheck(): void {
    // We need to trigger CD manually here, because we had to remove the container component from the embedded views
    // of the selection area. Therefore the containers CD would never run. With this construct we would trigger
    // CD on the container the same way as if it would still be in the tree under the selection area
    if (this._containerInstance) {
      this._containerInstance._changeDetectorRef.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this._portalOutlet.dispose();
  }

  /** Closes and destroys the selected area */
  close(): void {
    this._containerInstance.close();
  }

  /** Sets the focus to the selection area */
  focus(): void {
    this._containerInstance.focus();
  }

  /** @internal creates the selected area on the container with the given position */
  _createSelectedArea(posX: number): void {
    this._containerInstance._create(posX);
  }

  /** @internal Passes the interpolateFn from the origin to the container */
  _setInterpolateFnOnContainer(fn: (pxValue: number) => number): void {
    if (this._containerInstance) {
      this._containerInstance._interpolateFn = fn;
    }
  }

  /** Apply boundaries to the container element to match the origin */
  private _applyBoundariesToContainer(boundaries: ClientRect): void {
    if (this._containerInstance) {
      this._containerInstance._applyBoundaries(boundaries);
    }
  }

  /** Defers the container events until the zone is stable and the container is ready */
  private _deferContainerEvent<T>(eventName: string): Observable<T> {
    return this._containerInstance
      ? this._containerInstance[eventName]
      : this._ngZone.onStable.asObservable().pipe(
          take(1),
          switchMap(() => this._deferContainerEvent(eventName)),
        );
  }

  /** Creates the container and the host element in the domportal on the body */
  // tslint:disable-next-line: deprecation
  private _createContainer(): DtSelectionAreaContainer | null {
    if (document) {
      // the viewContainerRef as a parameter to the component portal needs to be null so we dont create an
      // embedded view
      const portal = new ComponentPortal(
        // tslint:disable-next-line: deprecation
        DtSelectionAreaContainer,
        null,
        null,
        this._componentFactoryResolver,
      );
      this._portalOutlet = new DomPortalOutlet(
        this._createHostElement(),
        this._componentFactoryResolver,
        this._appRef,
        this._viewContainerRef.injector,
      );
      const componentRef = this._portalOutlet.attachComponentPortal(portal);
      return componentRef.instance;
    }
    return null;
  }

  /**
   * Creates the host element that wraps around an overlay
   * and can be used for advanced positioning.
   * @returns Newly-create host element.
   */
  private _createHostElement(): HTMLElement {
    const host = this._renderer.createElement('div');
    this._renderer.appendChild(this._getGlobalContainerElement(), host);
    return host;
  }

  /** Creates a new global container holds all selection area containers if needed and returns it */
  private _getGlobalContainerElement(): HTMLElement {
    if (!globalContainerElement) {
      this._createGlobalContainerInBody();
    }
    return globalContainerElement!;
  }

  /**
   * Create the overlay container element, which is simply a div
   * with the 'selection-area-container' class on the document body.
   */
  private _createGlobalContainerInBody(): void {
    const container = this._renderer.createElement('div');

    addCssClass(container, 'dt-selection-area-global-container');
    this._renderer.appendChild(document.body, container);
    globalContainerElement = container;
  }
}
