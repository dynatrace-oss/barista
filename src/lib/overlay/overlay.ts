import { Injectable, TemplateRef, ElementRef } from '@angular/core';
import { DtOverlayConfig } from './overlay-config';
import { Overlay, OverlayRef, OverlayConfig, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, TemplatePortal } from '@angular/cdk/portal';
import { DtOverlayContainer } from './overlay-container';
import { DtOverlayRef, DT_OVERLAY_NO_POINTER_CLASS } from './overlay-ref';
import { DtLogger, DtLoggerFactory } from '@dynatrace/angular-components';

const LOG: DtLogger = DtLoggerFactory.create('DtOverlayService');

export const DT_OVERLAY_DEFAULT_CONFIG: DtOverlayConfig = {
  enableClick: true,
  hasBackdrop: true,
  enableMouseMove: true,
  backdropClass: ['cdk-overlay-transparent-backdrop', DT_OVERLAY_NO_POINTER_CLASS],
};

@Injectable({ providedIn: 'root'})
export class DtOverlay {
  private _dtOverlayRef: DtOverlayRef | undefined;

  get overlayRef(): DtOverlayRef | undefined {
    return this._dtOverlayRef;
  }

  constructor(
    private _overlay: Overlay
  ) {}

  create<T>(
    origin: ElementRef,
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    userConfig?: DtOverlayConfig
  ): DtOverlayRef {
    if (this._dtOverlayRef && this._dtOverlayRef.overlayRef) {
      console.log('dispose');
      this._dtOverlayRef.overlayRef.dispose();
    }

    let positionStrategy = userConfig && userConfig.positionStrategy;
    if (!positionStrategy) {
      positionStrategy = this._overlay.position()
      .flexibleConnectedTo(origin)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        }]);
    }

    const config = { ...DT_OVERLAY_DEFAULT_CONFIG, positionStrategy, ...userConfig };

    const overlayRef: OverlayRef = this._overlay.create(config as OverlayConfig);
    const overlayContainer = this._attachOverlayContainer(overlayRef);
    this._attachOverlayContent(componentOrTemplateRef, overlayContainer);
    this._dtOverlayRef = new DtOverlayRef(overlayRef);

    return this._dtOverlayRef;
  }

  close(): void {
    const ref = this._dtOverlayRef;
    if (ref) {
      ref.overlayRef.detach();
      ref.overlayRef.dispose();

      this._dtOverlayRef = undefined;
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
