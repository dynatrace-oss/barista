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
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  isDevMode,
  Output,
  EventEmitter,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { _isValidColorHexValue } from '@dynatrace/barista-components/core';
import { getDtRadialChartInvalidHexColorValueError } from './radial-chart-errors';
import {
  coerceNumberProperty,
  NumberInput,
  BooleanInput,
  coerceBooleanProperty,
} from '@angular/cdk/coercion';

@Directive({
  selector: 'dt-radial-chart-series, [dtRadialChartSeries]',
  exportAs: 'dtRadialChartSeries',
})
export class DtRadialChartSeries implements OnChanges, OnDestroy {
  /** The series value (required) */
  @Input()
  get value(): number {
    return this._value;
  }
  set value(value: number) {
    this._value = coerceNumberProperty(value);
  }
  private _value: number;
  static ngAcceptInputType_value: NumberInput;

  /** The series name (required) */
  @Input() name: string;

  /** Marks series as selected */
  @Input()
  get selected(): boolean {
    return this._selected;
  }
  set selected(value: boolean) {
    this._selected = coerceBooleanProperty(value);
  }
  private _selected = false;
  static ngAcceptInputType_selected: BooleanInput;

  /** Marks series as active according to legend */
  @Input()
  get active(): boolean {
    return this._active;
  }
  set active(value: boolean) {
    this._active = coerceBooleanProperty(value);
  }
  private _active = true;
  static ngAcceptInputType_active: BooleanInput;

  /** Emits when event is selected. */
  @Output() selectedChange = new EventEmitter<boolean>();

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
  _stateChanges$ = new BehaviorSubject<DtRadialChartSeries>(this);

  ngOnChanges(): void {
    this._stateChanges$.next(this);
  }

  ngOnDestroy(): void {
    this._stateChanges$.complete();
  }
}
