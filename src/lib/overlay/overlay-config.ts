import {
  OverlayConfig,
  CloseScrollStrategy,
  BlockScrollStrategy,
  RepositionScrollStrategy,
  PositionStrategy,
} from '@angular/cdk/overlay';

export interface DtOverlayConfig extends OverlayConfig {
  scrollStrategy?: CloseScrollStrategy | BlockScrollStrategy | RepositionScrollStrategy;
  positionStrategy?: PositionStrategy;
  enableClick?: boolean;
  enableMouseMove?: boolean;
  enableFocus?: boolean;
  posX?: number;
  posY?: number;
}
