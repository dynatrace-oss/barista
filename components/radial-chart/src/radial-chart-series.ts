/**
 * @license
 * Copyright 2020 Dynatrace LLC
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
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  isDevMode,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { _isValidColorHexValue } from '@dynatrace/barista-components/core';
import { getDtRadialChartInvalidHexColorValueError } from './radial-chart-errors';

@Directive({
  selector: 'dt-radial-chart-series',
  exportAs: 'dtRadialChartSeries',
})
export class DtRadialChartSeries implements OnChanges, OnDestroy {
  /** The series value (required) */
  @Input() value: number;

  /** The series name (required) */
  @Input() name: string;

  /**
   * The series color value (optional)
   * When not given our predefined chart colors are used.
   */
  @Input()
  get color(): string | null {
    return this._color;
  }
  set color(value: string | null) {
    if (
      value !== undefined &&
      value !== null &&
      !_isValidColorHexValue(value) &&
      isDevMode()
    ) {
      throw getDtRadialChartInvalidHexColorValueError(value);
    }
    this._color = value;
  }
  private _color: string | null = null;

  /** @internal fires when any internal state changes */
  _stateChanges = new BehaviorSubject<DtRadialChartSeries>(this);

  ngOnChanges(): void {
    this._stateChanges.next(this);
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();
  }
}
