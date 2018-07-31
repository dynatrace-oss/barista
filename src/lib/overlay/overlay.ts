import { Injectable, TemplateRef, ElementRef, Inject } from '@angular/core';
import { DtOverlayConfig } from './overlay-config';
import { Overlay, OverlayRef, OverlayConfig, ViewportRuler, ConnectedPosition } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal, ComponentType } from '@angular/cdk/portal';
import { DtOverlayContainer } from './overlay-container';
import { DtOverlayRef, DT_OVERLAY_NO_POINTER_CLASS } from './overlay-ref';
import { DOCUMENT } from '@angular/common';
import { DtMouseFollowPositionStrategy } from './mouse-follow-position-strategy';
import { Platform } from '@angular/cdk/platform';

const DEFAULT_DT_OVERLAY_POSITIONS: ConnectedPosition[] = [
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetX: 6,
    offsetY: 6,
  },
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
    offsetX: 6,
    offsetY: 6,
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetX: 6,
    offsetY: -6,
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetX: 6,
    offsetY: -6,
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
    private _overlay: Overlay,
    private _viewportRuler: ViewportRuler,
    // tslint:disable-next-line:no-any
    @Inject(DOCUMENT) private _document: any,
    private _platform: Platform
  ) {}

  create<T>(
    origin: ElementRef,
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    userConfig?: DtOverlayConfig
  ): DtOverlayRef<T> {
    if (this._dtOverlayRef) {
      this._dtOverlayRef.close();
    }

    const config = { ...new DtOverlayConfig(), ...userConfig };

    const overlayRef: OverlayRef = this._createOverlay(origin, config);
    const overlayContainer = this._attachOverlayContainer(overlayRef);
    const dtOverlayRef = this._attachOverlayContent(componentOrTemplateRef, overlayContainer, overlayRef, config);

    this._dtOverlayRef = dtOverlayRef;

    return this._dtOverlayRef;
  }

  close(): void {
    const ref = this._dtOverlayRef;
    if (ref) {
      ref.close();

      this._dtOverlayRef = null;
    }
  }

  private _createOverlay(origin: ElementRef, config: DtOverlayConfig): OverlayRef {
    let positions = DEFAULT_DT_OVERLAY_POSITIONS;
    if (config.verticalAnchor === 'center') {
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
      backdropClass: DT_OVERLAY_NO_POINTER_CLASS,
      hasBackdrop: true,
    });
    return this._overlay.create(overlayConfig);
  }

  private _attachOverlayContainer(overlay: OverlayRef): DtOverlayContainer {
    const containerPortal =
        new ComponentPortal(DtOverlayContainer, null);
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
        new TemplatePortal<T>(componentOrTemplateRef, null!));
    } else {
      container.attachComponentPortal(new ComponentPortal<T>(componentOrTemplateRef));
    }

    return dtOverlayRef;
  }
}
