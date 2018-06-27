enum DtOverlayScrollStrategy { Block, Close, Reposition }
enum DtOverlayCloseStrategy { Disable, Enable }

export interface DtOverlayConfig {
  scrollStrategy: DtOverlayScrollStrategy;
  scrollCloseStrategy: DtOverlayCloseStrategy;
  enableClick: boolean;
  enableMouseMove: boolean;
  enableFocus: boolean;
}
