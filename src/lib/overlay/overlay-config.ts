import { OverlayConfig, CloseScrollStrategy, BlockScrollStrategy, RepositionScrollStrategy } from '@angular/cdk/overlay';

export interface DtOverlayConfig extends OverlayConfig {
  scrollStrategy?: CloseScrollStrategy | BlockScrollStrategy | RepositionScrollStrategy;
  enableClick?: boolean;
  enableMouseMove?: boolean;
  enableFocus?: boolean;
  posX?: number;
  posY?: number;
}
