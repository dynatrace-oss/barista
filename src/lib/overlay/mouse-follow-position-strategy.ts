import { FlexibleConnectedPositionStrategy, ViewportRuler, PositionStrategy, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { ElementRef } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

export class DtMouseFollowPositionStrategy implements PositionStrategy {

  private _flexiblePositionStrategy: FlexibleConnectedPositionStrategy;

  private _relativePositions: ConnectedPosition[];

  private _constraint: 'xAxis' | 'yAxis' | undefined;

  constructor(
    connectedTo: ElementRef | HTMLElement,
    _viewportRuler: ViewportRuler,
    _document: Document,
    _platform: Platform
  ) {
    this._flexiblePositionStrategy = new FlexibleConnectedPositionStrategy(connectedTo, _viewportRuler, _document, _platform);
  }

  attach(overlayRef: OverlayRef): void {
    this._flexiblePositionStrategy.attach(overlayRef);
  }

  apply(): void {
    this._flexiblePositionStrategy.apply();
  }

  dispose(): void {
    this._flexiblePositionStrategy.dispose();
  }

  get positions(): ConnectedPosition[] {
    return this._relativePositions;
  }

  withMovementContraint(constraint: 'xAxis' | 'yAxis'): DtMouseFollowPositionStrategy {
    this._constraint = constraint;
    return this;
  }

  withPositions(positions: ConnectedPosition[]): DtMouseFollowPositionStrategy {
    this._relativePositions = positions;
    this._flexiblePositionStrategy.withPositions(positions);
    return this;
  }

  /** applies mouseoffset to each given position */
  withMouseOffset(mouseOffsetX: number, mouseOffsetY: number): this {
    if (this._relativePositions) {
      this._flexiblePositionStrategy.withPositions(this._relativePositions.map((pos: ConnectedPosition) => {
        const posWithOffset = { ...pos };

        posWithOffset.offsetX = this._combineOffset(mouseOffsetX, pos.offsetX);
        posWithOffset.offsetY = this._combineOffset(mouseOffsetY, pos.offsetY);

        if (this._constraint === 'yAxis') {
          posWithOffset.offsetX = pos.offsetX;
        } else if (this._constraint === 'xAxis') {
          posWithOffset.offsetY = pos.offsetY;
        }
        return posWithOffset;
      }));
    }
    return this;
  }

  _combineOffset(mouseOffset: number, offset?: number): number {
    return offset ? offset + mouseOffset : mouseOffset;
  }
}
