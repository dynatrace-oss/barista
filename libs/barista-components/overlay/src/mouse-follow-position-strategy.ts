/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  OverlayContainer,
  OverlayRef,
  PositionStrategy,
  ViewportRuler,
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';

import { DtOverlayOrigin } from './overlay';

/**
 * @deprecated This should not be used anymore since the cdk positionstrategy now accepts a point (x, y) value
 * by setting the origin to the events x & y values and updating the position on each event
 * the same effect can be achieved
 */
export class DtMouseFollowPositionStrategy implements PositionStrategy {
  private _flexiblePositionStrategy: FlexibleConnectedPositionStrategy;

  private _relativePositions: ConnectedPosition[];

  private _constraint: 'xAxis' | 'yAxis';

  constructor(
    connectedTo: DtOverlayOrigin,
    viewportRuler: ViewportRuler,
    document: Document,
    platform: Platform,
    overlayContainer: OverlayContainer,
  ) {
    this._flexiblePositionStrategy = new FlexibleConnectedPositionStrategy(
      connectedTo,
      viewportRuler,
      document,
      platform,
      overlayContainer,
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
  withMovementContraint(constraint: 'xAxis' | 'yAxis'): this {
    this._constraint = constraint;
    return this;
  }

  /** sets the positions for the overlay */
  withPositions(positions: ConnectedPosition[]): this {
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
        }),
      );
    }
    return this;
  }

  private _combineOffset(mouseOffset: number, offset?: number): number {
    return offset ? offset + mouseOffset : mouseOffset;
  }
}
