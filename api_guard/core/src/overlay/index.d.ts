export interface ConnectedPosition {
  offsetX?: number;
  offsetY?: number;
  originX: 'start' | 'center' | 'end';
  originY: 'top' | 'center' | 'bottom';
  overlayX: 'start' | 'center' | 'end';
  overlayY: 'top' | 'center' | 'bottom';
  panelClass?: string | string[];
  weight?: number;
}

export declare class DtFlexibleConnectedPositionStrategy
  implements PositionStrategy {
  _preferredPositions: ConnectionPositionPair[];
  positionChanges: Observable<ConnectedOverlayPositionChange>;
  get positions(): ConnectionPositionPair[];
  constructor(
    connectedTo: FlexibleConnectedPositionStrategyOrigin,
    _viewportRuler: ViewportRuler,
    _document: Document,
    _platform: Platform,
    _overlayContainer: OverlayContainer,
  );
  apply(): void;
  attach(overlayRef: OverlayReference): void;
  detach(): void;
  dispose(): void;
  reapplyLastPosition(): void;
  setOrigin(origin: FlexibleConnectedPositionStrategyOrigin): this;
  withDefaultOffsetX(offset: number): this;
  withDefaultOffsetY(offset: number): this;
  withFlexibleDimensions(flexibleDimensions?: boolean): this;
  withGrowAfterOpen(growAfterOpen?: boolean): this;
  withLockedPosition(isLocked?: boolean): this;
  withPositions(positions: ConnectedPosition[]): this;
  withPush(canPush?: boolean): this;
  withScrollableContainers(scrollables: CdkScrollable[]): this;
  withTransformOriginOn(selector: string): this;
  withViewportBoundaries(boundaries: ViewportBoundaries): this;
  withViewportMargin(margin: number): this;
}

export declare type FlexibleConnectedPositionStrategyOrigin =
  | ElementRef
  | HTMLElement
  | (Point & {
      width?: number;
      height?: number;
    });

export interface ViewportBoundaries {
  left: number;
  top: number;
}
