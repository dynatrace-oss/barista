import { Injectable, TemplateRef, ElementRef, Optional, Inject, isDevMode } from '@angular/core';
import { DtScrollStrategyType, DtOverlayConfig } from './overlay-config';
import { Overlay, OverlayRef, OverlayConfig, ConnectedPosition } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, TemplatePortal } from '@angular/cdk/portal';
import { DtOverlayContainer } from './overlay-container';
import { DtOverlayRef, DT_OVERLAY_NO_POINTER_CLASS } from './overlay-ref';
import { DOCUMENT } from '@angular/common';
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { DtLogger, DtLoggerFactory } from '@dynatrace/angular-components';
import { FlexibleConnectedPositionStrategy, RepositionScrollStrategy, CloseScrollStrategy, BlockScrollStrategy } from '@angular/cdk/overlay';

const LOG: DtLogger = DtLoggerFactory.create('DtOverlayService');
const DEFAULT_SCROLL_STRATEGY_TYPE: DtScrollStrategyType = DtScrollStrategyType.Close;

const DEFAULT_DT_OVERLAY_POSITIONS: ConnectedPosition[] = [{
  originX: 'center',
  originY: 'bottom',
  overlayX: 'start',
  overlayY: 'top',
}, {
  originX: 'start',
  originY: 'top',
  overlayX: 'end',
  overlayY: 'bottom',
}]

export const DEFAULT_DT_OVERLAY_CONFIG: DtOverlayConfig = {
  enableClick: false,
  hasBackdrop: true,
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
    @Optional() @Inject(DOCUMENT) private _document: any
  ) {}

  public create<T>(
    origin: ElementRef,
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    c?: DtOverlayConfig,
  ): DtOverlayRef {

  const positions = c && c.positions || DEFAULT_DT_OVERLAY_POSITIONS;
  const scrollStrategyType = c && c.scrollStrategyType || DEFAULT_SCROLL_STRATEGY_TYPE;

  let positionStrategy: FlexibleConnectedPositionStrategy = this._overlay.position()
    .flexibleConnectedTo(origin)
    .withPositions(positions);

  let scrollStrategy: CloseScrollStrategy | BlockScrollStrategy | RepositionScrollStrategy
    = this._getStrategyType(scrollStrategyType);

    const config = { ...DEFAULT_DT_OVERLAY_CONFIG, ...c, positionStrategy: positionStrategy, scrollStrategy: scrollStrategy };

    const overlayRef: OverlayRef = this._overlay.create(config as OverlayConfig);
    const overlayContainer = this._attachOverlayContainer(overlayRef);
    this._attachOverlayContent(componentOrTemplateRef, overlayContainer);
    this._overlayRef = new DtOverlayRef(overlayRef);

    return this._overlayRef;
  }

  private _getStrategyType(scrollStrategyType: DtScrollStrategyType): CloseScrollStrategy | BlockScrollStrategy | RepositionScrollStrategy {
    let scrollStrategy;

    if(scrollStrategyType === DtScrollStrategyType.Close) {
      scrollStrategy = this._overlay.scrollStrategies.close();
    } else if (scrollStrategyType === DtScrollStrategyType.Reposition) {
      scrollStrategy = this._overlay.scrollStrategies.reposition();
    } else if (scrollStrategyType === DtScrollStrategyType.Block) {
      scrollStrategy = this._overlay.scrollStrategies.block();
    }

    return scrollStrategy;
  }

  public close(): void {
    const ref = this._overlayRef;
    if (ref) {
      ref.overlayRef.detach();
      ref.overlayRef.dispose();
      this._overlayRef = undefined;
      this.setFocus();
    }
  }

  public setFocus(): void {
    if (this._overlayRef) {
      this._savePreviouslyFocusedElement();
    } else {
      this._restoreFocus();
    }
  }

  /** Moves the focus inside the focus trap. */
  public trapFocus(): void {
    const ref = this._overlayRef;
    if (ref && !this._focusTrap) {
      this._focusTrap = this._focusTrapFactory.create(ref.overlayRef.overlayElement);
    } else if (ref && this._focusTrap) {
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
