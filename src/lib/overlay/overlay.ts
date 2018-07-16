import { Injectable, TemplateRef, ElementRef, Inject } from '@angular/core';
import { DtOverlayConfig } from './overlay-config';
import { Overlay, OverlayRef, OverlayConfig, ViewportRuler, ConnectedPosition } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { DtOverlayContainer } from './overlay-container';
import { DtOverlayRef, DT_OVERLAY_NO_POINTER_CLASS } from './overlay-ref';
import { DtLogger, DtLoggerFactory } from '@dynatrace/angular-components/core';
import { DOCUMENT } from '@angular/common';
import { MouseFollowPositionStrategy } from './mouse-follow-position-strategy';
import { Platform } from '@angular/cdk/platform';

const LOG: DtLogger = DtLoggerFactory.create('DtOverlayService');
const DEFAULT_SCROLL_STRATEGY_TYPE: DtScrollStrategyType = DtScrollStrategyType.Close;

const DEFAULT_DT_OVERLAY_POSITIONS: ConnectedPosition[] = [{
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
}]

const DEFAULT_DT_OVERLAY_POSITIONS: ConnectedPosition[] = [
  {
    originX: 'start',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'top',
    offsetX: 12,
    offsetY: 6,
  },
  {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'top',
    offsetX: -6,
    offsetY: 6,
  },
  {
    originX: 'start',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetX: 12,
    offsetY: -6,
  },
  {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetX: -6,
    offsetY: -6,
  },
  {
    originX: 'center',
    originY: 'center',
    overlayX: 'center',
    overlayY: 'top',
  },
];

@Injectable({ providedIn: 'root'})
export class DtOverlay {
  private _dtOverlayRef: DtOverlayRef<any> | null;

  get overlayRef(): DtOverlayRef<any> | null {
    return this._dtOverlayRef;
  }

  constructor(
    private _overlay: Overlay,
    private _viewportRuler: ViewportRuler,
    @Inject(DOCUMENT) private _document: any,
    private _platform: Platform
  ) {}

  create<T>(
    origin: ElementRef,
    templateRef: TemplateRef<T>,
    userConfig?: DtOverlayConfig
  ): DtOverlayRef<T> {
    if (this._dtOverlayRef) {
      this._dtOverlayRef.close();
    }

    const config = { ...new DtOverlayConfig(), ...userConfig };

    const overlayRef: OverlayRef = this._createOverlay(config, origin);
    const overlayContainer = this._attachOverlayContainer(overlayRef);
    const dtOverlayRef = this._attachOverlayContent(templateRef, overlayContainer, overlayRef);

    this._dtOverlayRef = dtOverlayRef;

    return this._dtOverlayRef;
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

  close(): void {
    const ref = this._dtOverlayRef;
    if (ref) {
      ref.close();

      this._dtOverlayRef = null;
    }
  }

  private _createOverlay(config: DtOverlayConfig, origin: ElementRef): OverlayRef {
    const positionStrategy = new MouseFollowPositionStrategy(origin, this._viewportRuler, this._document, this._platform)
    .withPositions(DEFAULT_DT_OVERLAY_POSITIONS);

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
    templateRef: TemplateRef<T>,
    container: DtOverlayContainer,
    overlayRef: OverlayRef
  ): DtOverlayRef<T> {

    const dtOverlayRef = new DtOverlayRef<T>(overlayRef, container);

    container.attachTemplatePortal(
      new TemplatePortal<T>(templateRef, null!));

    return dtOverlayRef;
  }
}
