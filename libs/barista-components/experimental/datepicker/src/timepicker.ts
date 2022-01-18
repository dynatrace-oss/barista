/**
 * @license
 * Copyright 2021 Dynatrace LLC
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
  coerceBooleanProperty,
  coerceNumberProperty,
  NumberInput,
  BooleanInput,
} from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { isDefined } from '@dynatrace/barista-components/core';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { DtTimeChangeEvent, DtTimeInput } from './timeinput';

@Component({
  selector: 'dt-timepicker',
  templateUrl: 'timepicker.html',
  styleUrls: ['timepicker.scss'],
  host: {
    class: 'dt-timepicker',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtTimepicker {
  /** Label used for displaying the date in range mode. */
  @Input()
  valueLabel: string;

  /** Contains the hour value that is depicted in the timeInput component */
  @Input()
  get hour(): number | null {
    return this._hour;
  }
  set hour(value: number | null) {
    this._hour = isDefined(value) ? coerceNumberProperty(value) : null;
    this._changeDetectorRef.markForCheck();
  }
  private _hour: number | null = null;
  static ngAcceptInputType_hour: NumberInput;

  /** Contains the minute value that is depicted in the timeInput component */
  @Input()
  get minute(): number | null {
    return this._minute;
  }
  set minute(value: number | null) {
    this._minute = isDefined(value) ? coerceNumberProperty(value) : null;
    this._changeDetectorRef.markForCheck();
  }
  private _minute: number | null = null;
  static ngAcceptInputType_minute: NumberInput;

  /** The minimum selectable hour. */
  @Input()
  get minHour(): number | null {
    return this._minHour;
  }
  set minHour(value: number | null) {
    this._minHour = isDefined(value) ? coerceNumberProperty(value) : null;
  }
  private _minHour: number | null = null;
  static ngAcceptInputType_minHour: NumberInput;

  /** The minimum selectable minute. */
  @Input()
  get minMinute(): number | null {
    return this._minMinute;
  }
  set minMinute(value: number | null) {
    this._minMinute = isDefined(value) ? coerceNumberProperty(value) : null;
  }
  private _minMinute: number | null = null;
  static ngAcceptInputType_minMinute: NumberInput;

  /** The maximum selectable hour. */
  @Input()
  get maxHour(): number | null {
    return this._maxHour;
  }
  set maxHour(value: number | null) {
    this._maxHour = isDefined(value) ? coerceNumberProperty(value) : null;
  }
  private _maxHour: number | null = null;
  static ngAcceptInputType_maxHour: NumberInput;

  /** The maximum selectable minute. */
  @Input()
  get maxMinute(): number | null {
    return this._maxMinute;
  }
  set maxMinute(value: number | null) {
    this._maxMinute = isDefined(value) ? coerceNumberProperty(value) : null;
  }
  private _maxMinute: number | null = null;
  static ngAcceptInputType_maxMinute: NumberInput;

  /**
   * @internal
   * Property used for enabling the time range mode.
   */
  _isTimeRangeEnabled = false;

  /** Binding for the disabled state. */
  @Input()
  get disabled(): boolean {
    return this._isDisabled;
  }
  set disabled(disabled: boolean) {
    this._isDisabled = coerceBooleanProperty(disabled);
    this._changeDetectorRef.markForCheck();
  }
  private _isDisabled = false;
  static ngAcceptInputType_disabled: BooleanInput;

  /** @internal Reference to the timeInput component */
  @ViewChild(DtTimeInput) _timeInput: DtTimeInput;

  /** Provides an event when the time input has changed */
  @Output()
  timeChange: Observable<DtTimeChangeEvent>;

  constructor(
    private _zone: NgZone,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.timeChange = this._zone.onMicrotaskEmpty.pipe(
      take(1),
      switchMap(() => this._timeInput.timeChange.asObservable()),
    );
  }
}
