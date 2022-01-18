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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';

import {
  CanColor,
  Constructor,
  DtProgressChange,
  HasProgressValues,
  mixinColor,
  mixinHasProgress,
} from '@dynatrace/barista-components/core';

/** Circumference for the path data in the html file - this does not change unless the path is changed */
const CIRCLE_CIRCUMFERENCE = 328;

export type DtProgressCircleChange = DtProgressChange;

export type DtProgressCircleThemePalette =
  | 'main'
  | 'accent'
  | 'warning'
  | 'recovered'
  | 'error';

export class DtProgressCircleBase {
  constructor(public _elementRef: ElementRef) {}
}

export const _DtProgressCircle = mixinHasProgress(
  mixinColor<Constructor<DtProgressCircleBase>, DtProgressCircleThemePalette>(
    DtProgressCircleBase,
    'main',
  ),
);

@Component({
  selector: 'dt-progress-circle',
  templateUrl: 'progress-circle.html',
  styleUrls: ['progress-circle.scss'],
  exportAs: 'dtProgressCircle',
  host: {
    class: 'dt-progress-circle',
    role: 'progressbar',
    '[attr.aria-valuemin]': 'min',
    '[attr.aria-valuemax]': 'max',
    '[attr.aria-valuenow]': 'value',
  },
  inputs: ['color', 'value', 'min', 'max'],
  outputs: ['valueChange'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtProgressCircle
  extends _DtProgressCircle
  implements CanColor<DtProgressCircleThemePalette>, HasProgressValues
{
  /** @internal Dash offset base on the values percentage */
  _dashOffset: number = CIRCLE_CIRCUMFERENCE;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    public _elementRef: ElementRef,
  ) {
    super(_elementRef);
  }

  /** @internal Updates all view parameters */
  _updateValues(): void {
    super._updateValues();
    this._dashOffset = this._calculateDashOffset(this.percent);

    // Since this also modifies the percentage and dashOffset,
    // we need to let the change detection know.
    this._changeDetectorRef.markForCheck();
  }

  /** Calculates the dash offset of the progress circle based on the calculated percent */
  private _calculateDashOffset(percent: number): number {
    // eslint-disable-next-line no-magic-numbers
    return CIRCLE_CIRCUMFERENCE - (CIRCLE_CIRCUMFERENCE / 100) * percent;
  }
}
