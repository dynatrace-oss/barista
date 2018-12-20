import { Injectable, TemplateRef, ElementRef, Inject, NgZone, Injector } from '@angular/core';
import { DtOverlayConfig } from './overlay-config';
import { Overlay, OverlayRef, OverlayConfig, ViewportRuler, ConnectedPosition, CloseScrollStrategy, ScrollDispatcher, NoopScrollStrategy, RepositionScrollStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal, ComponentType, PortalInjector } from '@angular/cdk/portal';
import { DtOverlayContainer } from './overlay-container';
import { DtOverlayRef } from './overlay-ref';
import { DOCUMENT } from '@angular/common';
import { DtMouseFollowPositionStrategy } from './mouse-follow-position-strategy';
import { Platform } from '@angular/cdk/platform';

export const DT_OVERLAY_DEFAULT_OFFSET = 6;

const DEFAULT_DT_OVERLAY_POSITIONS: ConnectedPosition[] = [
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetX: DT_OVERLAY_DEFAULT_OFFSET,
    offsetY: DT_OVERLAY_DEFAULT_OFFSET,
  },
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
    offsetX: DT_OVERLAY_DEFAULT_OFFSET,
    offsetY: DT_OVERLAY_DEFAULT_OFFSET,
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetX: DT_OVERLAY_DEFAULT_OFFSET,
    offsetY: -DT_OVERLAY_DEFAULT_OFFSET,
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetX: DT_OVERLAY_DEFAULT_OFFSET,
    offsetY: -DT_OVERLAY_DEFAULT_OFFSET,
  },
  {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'top',
  },
];

@Injectable({ providedIn: 'root'})
export class DtOverlay {
  // tslint:disable-next-line:no-any
  private _dtOverlayRef: DtOverlayRef<any> | null;

  // tslint:disable-next-line:no-any
  get overlayRef(): DtOverlayRef<any> | null {
    return this._dtOverlayRef;
  }

  constructor(
    private _injector: Injector,
    private _overlay: Overlay,
    private _viewportRuler: ViewportRuler,
    // tslint:disable-next-line:no-any
    @Inject(DOCUMENT) private _document: any,
    private _platform: Platform,
    private _ngZone: NgZone,
    private _scrollDispatcher: ScrollDispatcher
  ) {}

  create<T>(
    origin: ElementRef | HTMLElement | SVGElement,
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    userConfig?: DtOverlayConfig
  ): DtOverlayRef<T> {
    if (this._dtOverlayRef) {
      this._dtOverlayRef.dismiss();
    }

    const config = { ...new DtOverlayConfig(), ...userConfig };

    const overlayRef = this._createOverlay(origin, config);
    const overlayContainer = this._attachOverlayContainer(overlayRef, config);
    const dtOverlayRef = this._attachOverlayContent(componentOrTemplateRef, overlayContainer, overlayRef, config);

    this._dtOverlayRef = dtOverlayRef;

    return this._dtOverlayRef;
  }

  dismiss(): void {
    const ref = this._dtOverlayRef;
    if (ref) {
      ref.dismiss();

      this._dtOverlayRef = null;
    }
  }

  private _createOverlay(origin: ElementRef | HTMLElement | SVGElement, config: DtOverlayConfig): OverlayRef {
    let positions = config._positions || DEFAULT_DT_OVERLAY_POSITIONS;
    if (!config._positions && config.originY === 'center') {
      positions = positions.map((pos) => {
        const newPos = {...pos};
        newPos.originY = 'center';
        return newPos;
      });
    }

    const positionStrategy = new DtMouseFollowPositionStrategy(origin, this._viewportRuler, this._document, this._platform)
    .withPositions(positions);

    if (config.movementConstraint) {
      positionStrategy.withMovementContraint(config.movementConstraint);
    }

    const overlayConfig = new OverlayConfig({
      positionStrategy,
      backdropClass: 'dt-no-pointer',
      hasBackdrop: true,
      scrollStrategy: this._overlay.scrollStrategies.close(),
    });
    return this._overlay.create(overlayConfig);
  }

  private _attachOverlayContainer(overlay: OverlayRef, config: DtOverlayConfig): DtOverlayContainer {
    const injector = new PortalInjector(this._injector, new WeakMap([
      [DtOverlayConfig, config],
    ]));
    const containerPortal =
        new ComponentPortal(DtOverlayContainer, null, injector);
    const containerRef = overlay.attach<DtOverlayContainer>(containerPortal);

    return containerRef.instance;
  }

  private _attachOverlayContent<T>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    container: DtOverlayContainer,
    overlayRef: OverlayRef,
    config: DtOverlayConfig
  ): DtOverlayRef<T> {

    const dtOverlayRef = new DtOverlayRef<T>(overlayRef, container, config);

    if (componentOrTemplateRef instanceof TemplateRef) {
      container.attachTemplatePortal(
        // tslint:disable-next-line:no-any
        new TemplatePortal<any>(componentOrTemplateRef, null!, { $implicit: config.data }));
    } else {
      container.attachComponentPortal(new ComponentPortal<T>(componentOrTemplateRef));
    }

    return dtOverlayRef;
  }
}
