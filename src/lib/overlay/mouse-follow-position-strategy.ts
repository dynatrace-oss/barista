import { FlexibleConnectedPositionStrategy, ViewportRuler, PositionStrategy, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { ElementRef } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

export class DtMouseFollowPositionStrategy implements PositionStrategy {

  private _flexiblePositionStrategy: FlexibleConnectedPositionStrategy;

  private _relativePositions: ConnectedPosition[];

  private _mouseOffsetX: number;
  private _mouseOffsetY: number;

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
    console.log('set constraint');
    return this;
  }

  setOrigin(origin: ElementRef): DtMouseFollowPositionStrategy {
    this._flexiblePositionStrategy.setOrigin(origin);
    return this;
  }

  withPositions(positions: ConnectedPosition[]): DtMouseFollowPositionStrategy {
    this._relativePositions = positions;
    this._flexiblePositionStrategy.withPositions(positions);
    return this;
  }

  /** applies mouseoffset to each given position */
  _withMouseOffset(offsetX?: number, offsetY?: number): this {
    if (offsetX) {
      this._mouseOffsetX = offsetX;
    }
    if (offsetY) {
      this._mouseOffsetY = offsetY;
    }
    if (this._relativePositions) {
      this._flexiblePositionStrategy.withPositions(this._relativePositions.map((pos: ConnectedPosition) => {
        const posWithOffset = { ...pos };
        posWithOffset.offsetX = pos.offsetX ? pos.offsetX + this._mouseOffsetX : this._mouseOffsetX;
        posWithOffset.offsetY = pos.offsetY ? pos.offsetY + this._mouseOffsetY : this._mouseOffsetY;
        return posWithOffset;
      }));
    }
    return this;
  }

}
