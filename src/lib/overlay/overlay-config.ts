import { OverlayConfig, CloseScrollStrategy, BlockScrollStrategy, RepositionScrollStrategy, ConnectedPosition } from '@angular/cdk/overlay';

export enum DtScrollStrategyType { Close = 'close', Block = 'block', Reposition = 'reposition' }

export interface DtOverlayConfig extends OverlayConfig {
  scrollStrategy?: CloseScrollStrategy | BlockScrollStrategy | RepositionScrollStrategy;
  scrollStrategyType?: DtScrollStrategyType;
  enableClick?: boolean;
  enableFocus?: boolean;
  positions?: ConnectedPosition[];
}
