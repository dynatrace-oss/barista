enum DtOverlayScrollStrategy {Block, Close, Reposition}
enum DtOverlayCloseStrategy {Disable, Enable}
enum DtOverlayMovementStrategy {X, Y}

export interface DtOverlayConfigInterface {
  scrollStrategy: DtOverlayScrollStrategy;
  scrollCloseStrategy: DtOverlayCloseStrategy;
  movementStrategy: DtOverlayMovementStrategy;
  enableClick: boolean;
  enableMouseMove: boolean;
  enableFocus: boolean;
}
