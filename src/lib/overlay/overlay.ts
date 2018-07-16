import { Injectable, TemplateRef, ElementRef, Optional, Inject, isDevMode, NgZone } from '@angular/core';
import { DtOverlayConfig } from './overlay-config';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, TemplatePortal, CdkPortalOutlet } from '@angular/cdk/portal';
import { DtOverlayContainer } from './overlay-container';
import { DtOverlayRef, DT_OVERLAY_NO_POINTER_CLASS } from './overlay-ref';
import { DOCUMENT } from '@angular/common';
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { DtLogger, DtLoggerFactory } from '@dynatrace/angular-components';
import { GlobalPositionStrategy, FlexibleConnectedPositionStrategy, RepositionScrollStrategy, CloseScrollStrategy, BlockScrollStrategy } from '@angular/cdk/overlay';
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';

const LOG: DtLogger = DtLoggerFactory.create('DtOverlayService');

export const DEFAULT_DT_OVERLAY_CONFIG: DtOverlayConfig = {
  enableClick: true,
  hasBackdrop: true,
  enableMouseMove: true,
  backdropClass: ['cdk-overlay-transparent-backdrop', DT_OVERLAY_NO_POINTER_CLASS],
};

@Injectable({ providedIn: 'root'})
export class DtOverlayService {
  private _overlayRef: DtOverlayRef | undefined;

  /**
   * Element that was focused before the overlay was opened.
   * Save this to restore upon close.
   */
  private _elementFocusedBeforeOverlayWasOpened: HTMLElement | null = null;

  /** The class that traps and manages focus within the overlay. */
  private _focusTrap: FocusTrap | null;

  get overlayRef(): DtOverlayRef | undefined {
    return this._overlayRef;
  }

  constructor(
    private _overlay: Overlay,
    private _focusTrapFactory: FocusTrapFactory,
    private _scrollDispatcher: ScrollDispatcher,
    private _viewportRuler: ViewportRuler,
    private _ngZone: NgZone,
    @Optional() @Inject(DOCUMENT) private _document: any
  ) {}

  public create<T>(origin: ElementRef, componentOrTemplateRef: ComponentType<T> | TemplateRef<T>, positionStrategyType: string, scrollPositionStrategyType: string, c?: DtOverlayConfig): DtOverlayRef {

    let positionStrategy: GlobalPositionStrategy | FlexibleConnectedPositionStrategy = this._overlay.position()
          .flexibleConnectedTo(origin)
          .withPositions([{
            originX: 'center',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetX: 5,
            offsetY: 5
          }, {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'top',
            offsetX: 5,
            offsetY: 5
          }]);

    console.log(c)

    if (positionStrategyType === 'global') {
      positionStrategy = this._overlay.position()
      .global()
    }

    let scrollPositionStrategy: RepositionScrollStrategy | BlockScrollStrategy | CloseScrollStrategy = this._overlay.scrollStrategies.close();

    if(scrollPositionStrategyType === 'reposition') {
      scrollPositionStrategy = this._overlay.scrollStrategies.reposition();
    } else if (scrollPositionStrategyType === 'block') {
      scrollPositionStrategy = this._overlay.scrollStrategies.block();
    }

    const config = { ...DEFAULT_DT_OVERLAY_CONFIG, positionStrategy: positionStrategy, scrollStrategy: scrollPositionStrategy, ...c };

    const overlayRef: OverlayRef = this._overlay.create(config as OverlayConfig);
    const overlayContainer = this._attachOverlayContainer(overlayRef);
    this._attachOverlayContent(componentOrTemplateRef, overlayContainer);
    this._overlayRef = new DtOverlayRef(overlayRef);

    // console.log(overlayRef);
   // this._overlay.scrollStrategies.close().enable();

    //this._overlay.scrollStrategies.reposition().attach(overlayRef);

    // console.log(scrollPositionStrategy)


    return this._overlayRef;
  }

  public close(): void {
    const ref = this._overlayRef;
    if (ref) {
      ref.overlayRef.detach();
      ref.overlayRef.dispose();
      // ref.focus();
      this._overlayRef = undefined;
      this.setFocus();
      console.log('closing')
    }
  }

  public setFocus(): void {
    console.log('setFocus')
    if (this._overlayRef) {
      console.log('a')
      this._savePreviouslyFocusedElement();
    } else {
      console.log('b')
      this._restoreFocus();
    }
  }

  /** Focuses the context-dialog element. */
  // focus(): void {
  //   // this._overlayRef.nativeElement.focus();
  //   if(this._overlayRef) {
  //     this._overlayRef.overlayRef.overlayElement.focus();
  //   }
  // }

  /** Moves the focus inside the focus trap. */
  public trapFocus(): void {
    if (this._overlayRef && !this._focusTrap) {
      // TODO: fix the duplicate overlayRef in the param train wreck
      this._focusTrap = this._focusTrapFactory.create(this._overlayRef.overlayRef.overlayElement);
      console.log('move focus on overlay')
      focus();
    } else if (this._overlayRef && this._focusTrap) {
      this._focusTrap.focusInitialElementWhenReady()
      .catch((error: Error) => {
        if (isDevMode()) {
          LOG.debug('Error when trying to set initial focus', error);
        }
      });
    }
  }

  /** Restores focus to the element that was focused before the overlay opened. */
  private _restoreFocus(): void {
    const toFocus = this._elementFocusedBeforeOverlayWasOpened;

    console.log('restore focus to', toFocus)

    // We need the extra check, because IE can set the `activeElement` to null in some cases.
    // tslint:disable-next-line: strict-type-predicates no-unbound-method
    if (toFocus && typeof toFocus.focus === 'function') {
      toFocus.focus();
    }

    if (this._focusTrap) {
      /** Destroy the focus trap */
      this._focusTrap.destroy();
      /** reset the focus trap to null to create a new one on subsequent open calls */
      this._focusTrap = null;
    }
  }

  /** Saves a reference to the element that was focused before the overlay was opened. */
  private _savePreviouslyFocusedElement(): void {
    if (this._document) {
      this._elementFocusedBeforeOverlayWasOpened = this._document.activeElement as HTMLElement;
      console.log('save previously focused element', this._elementFocusedBeforeOverlayWasOpened)
    }
  }

  private _attachOverlayContainer(overlay: OverlayRef): DtOverlayContainer {
    const containerPortal =
        new ComponentPortal(DtOverlayContainer, null);
    const containerRef = overlay.attach<DtOverlayContainer>(containerPortal);

    return containerRef.instance;
  }

  private _attachOverlayContent<T>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    container: DtOverlayContainer): void {

    if (componentOrTemplateRef instanceof TemplateRef) {
      container.attachTemplatePortal(
        new TemplatePortal<T>(componentOrTemplateRef, null!));
    } else {
      container.attachComponentPortal<T>(
          new ComponentPortal(componentOrTemplateRef));
    }
  }
}
