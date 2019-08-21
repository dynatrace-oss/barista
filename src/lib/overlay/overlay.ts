import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayContainer,
  OverlayRef,
  ViewportRuler,
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import {
  ComponentPortal,
  ComponentType,
  PortalInjector,
  TemplatePortal,
} from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ElementRef,
  Inject,
  Injectable,
  Injector,
  OnDestroy,
  TemplateRef,
} from '@angular/core';

import { DtMouseFollowPositionStrategy } from './mouse-follow-position-strategy';
import { DtOverlayConfig } from './overlay-config';
import { DtOverlayContainer } from './overlay-container';
import { DtOverlayRef } from './overlay-ref';

// TODO: FlexibleConnectedPositionStrategyOrigin is not exported by cdk/overlay
// https://github.com/angular/material2/blob/master/src/cdk/overlay/position/flexible-connected-position-strategy.ts#L33
export type DtOverlayOrigin =
  | ElementRef
  | HTMLElement
  | { x: number; y: number };
export const DT_OVERLAY_DEFAULT_OFFSET = 12;

const DT_OVERLAY_POSITIONS: ConnectedPosition[] = [
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
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
    overlayY: 'top',
    offsetX: -DT_OVERLAY_DEFAULT_OFFSET,
    offsetY: DT_OVERLAY_DEFAULT_OFFSET,
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetX: -DT_OVERLAY_DEFAULT_OFFSET,
    offsetY: -DT_OVERLAY_DEFAULT_OFFSET,
  },
];

/**
 * Css class that is used to disable pointerevents on the backdrop
 * @internal
 */
export const DT_OVERLAY_NO_POINTER_CLASS = 'dt-no-pointer';

@Injectable({ providedIn: 'root' })
export class DtOverlay implements OnDestroy {
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
    private _overlayContainer: OverlayContainer,
  ) {}

  ngOnDestroy(): void {
    this.dismiss();
  }

  /** Create an overlay reference. */
  create<T>(
    origin: DtOverlayOrigin,
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    userConfig?: DtOverlayConfig,
  ): DtOverlayRef<T> {
    if (this._dtOverlayRef) {
      this._dtOverlayRef.dismiss();
    }

    const config = { ...new DtOverlayConfig(), ...userConfig };

    const overlayRef = this._createOverlay(origin, config);
    const overlayContainer = this._attachOverlayContainer(overlayRef, config);
    const dtOverlayRef = this._attachOverlayContent(
      componentOrTemplateRef,
      overlayContainer,
      overlayRef,
      config,
    );

    dtOverlayRef.disposableFns.push(() => {
      this._dtOverlayRef = null;
    });
    this._dtOverlayRef = dtOverlayRef;

    return this._dtOverlayRef;
  }

  /** Dismisses the overlay and resets the given reference. */
  dismiss(): void {
    if (this._dtOverlayRef) {
      this._dtOverlayRef.dismiss();
    }
  }

  /** Creates an overlay with a certain origin and configuration. */
  private _createOverlay(
    origin: DtOverlayOrigin,
    config: DtOverlayConfig,
  ): OverlayRef {
    const positionStrategy = new DtMouseFollowPositionStrategy(
      origin,
      this._viewportRuler,
      this._document,
      this._platform,
      this._overlayContainer,
    ).withPositions(DT_OVERLAY_POSITIONS);

    if (config.movementConstraint) {
      positionStrategy.withMovementContraint(config.movementConstraint);
    }

    const overlayConfig = new OverlayConfig({
      positionStrategy,
      backdropClass: DT_OVERLAY_NO_POINTER_CLASS,
      hasBackdrop: true,
      scrollStrategy: this._overlay.scrollStrategies.close(),
    });
    return this._overlay.create(overlayConfig);
  }

  /** Attaches the overlay container. */
  private _attachOverlayContainer(
    overlay: OverlayRef,
    config: DtOverlayConfig,
  ): DtOverlayContainer {
    const injector = new PortalInjector(
      this._injector,
      new WeakMap([[DtOverlayConfig, config]]),
    );
    const containerPortal = new ComponentPortal(
      DtOverlayContainer,
      null,
      injector,
    );
    const containerRef = overlay.attach<DtOverlayContainer>(containerPortal);

    return containerRef.instance;
  }

  /** Attaches the given component or template to the passed container. */
  private _attachOverlayContent<T>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    container: DtOverlayContainer,
    overlayRef: OverlayRef,
    config: DtOverlayConfig,
  ): DtOverlayRef<T> {
    const dtOverlayRef = new DtOverlayRef<T>(overlayRef, container, config);

    if (componentOrTemplateRef instanceof TemplateRef) {
      container.attachTemplatePortal(
        // tslint:disable-next-line:no-any
        new TemplatePortal<any>(componentOrTemplateRef, null!, {
          $implicit: config.data,
        }),
      );
    } else {
      const componentRef = container.attachComponentPortal(
        new ComponentPortal<T>(componentOrTemplateRef),
      );
      dtOverlayRef.componentInstance = componentRef.instance;
    }

    return dtOverlayRef;
  }
}
