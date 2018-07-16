import { OverlayConfig, CloseScrollStrategy, BlockScrollStrategy, RepositionScrollStrategy } from '@angular/cdk/overlay';

enum DtOverlayScrollStrategy { Block, Close, Reposition }
enum DtOverlayCloseStrategy { Disable, Enable }

export interface DtOverlayConfig extends OverlayConfig {
  scrollStrategy?: CloseScrollStrategy | BlockScrollStrategy | RepositionScrollStrategy;
  enableClick?: boolean;
  enableMouseMove?: boolean;
  enableFocus?: boolean;
  posX?: number;
  posY?: number;
}
