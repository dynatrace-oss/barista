import {
  FlexibleConnectedPositionStrategy,
  ViewportRuler,
  PositionStrategy,
  OverlayRef,
  ConnectedPosition,
  OverlayContainer,
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { DtOverlayOrigin } from './overlay';

export class DtMouseFollowPositionStrategy implements PositionStrategy {
  private _flexiblePositionStrategy: FlexibleConnectedPositionStrategy;

  private _relativePositions: ConnectedPosition[];

  private _constraint: 'xAxis' | 'yAxis' | undefined;

  constructor(
    connectedTo: DtOverlayOrigin,
    viewportRuler: ViewportRuler,
    document: Document,
    platform: Platform,
    overlayContainer: OverlayContainer
  ) {
    this._flexiblePositionStrategy = new FlexibleConnectedPositionStrategy(
      connectedTo,
      viewportRuler,
      document,
      platform,
      overlayContainer
    );
  }

  /** attaches the strategy */
  attach(overlayRef: OverlayRef): void {
    this._flexiblePositionStrategy.attach(overlayRef);
  }

  /** applies the strategy with given settings */
  apply(): void {
    this._flexiblePositionStrategy.apply();
  }

  /** disposes strategy */
  dispose(): void {
    this._flexiblePositionStrategy.dispose();
  }

  /** sets the movement constraint */
  withMovementContraint(
    constraint: 'xAxis' | 'yAxis'
  ): DtMouseFollowPositionStrategy {
    this._constraint = constraint;
    return this;
  }

  /** sets the positions for the overlay */
  withPositions(positions: ConnectedPosition[]): DtMouseFollowPositionStrategy {
    this._relativePositions = positions;
    this._flexiblePositionStrategy.withPositions(positions);
    return this;
  }

  /** applies offset to each given position */
  withOffset(offsetX: number, offsetY: number): this {
    if (this._relativePositions) {
      this._flexiblePositionStrategy.withPositions(
        this._relativePositions.map((pos: ConnectedPosition) => {
          const posWithOffset = { ...pos };

          posWithOffset.offsetX = this._combineOffset(offsetX, pos.offsetX);
          posWithOffset.offsetY = this._combineOffset(offsetY, pos.offsetY);

          if (this._constraint === 'yAxis') {
            posWithOffset.offsetX = pos.offsetX;
          } else if (this._constraint === 'xAxis') {
            posWithOffset.offsetY = pos.offsetY;
          }
          return posWithOffset;
        })
      );
    }
    return this;
  }

  private _combineOffset(mouseOffset: number, offset?: number): number {
    return offset ? offset + mouseOffset : mouseOffset;
  }
}
