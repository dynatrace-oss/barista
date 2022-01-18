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

import { FocusOrigin } from '@angular/cdk/a11y';
import {
  coerceBooleanProperty,
  NumberInput,
  coerceNumberProperty,
  BooleanInput,
} from '@angular/cdk/coercion';
import { SHIFT, TAB } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  isDefined,
  isEmpty,
  isString,
  _readKeyCode,
} from '@dynatrace/barista-components/core';
import {
  clampHours,
  clampMinutes,
  hasMininmumTwoDigits,
  isPastedTimeValid,
  isValidHour,
  isValidMinute,
  valueTo2DigitString,
} from './datepicker-utils/util';
export class DtTimeChangeEvent {
  format(): string {
    return `${valueTo2DigitString(this.hour)}
    : ${valueTo2DigitString(this.minute)}`;
  }
  constructor(public hour: number, public minute: number) {}
}

@Component({
  selector: 'dt-timeinput',
  templateUrl: 'timeinput.html',
  styleUrls: ['timeinput.scss'],
  host: {
    class: 'dt-timeinput',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtTimeInput {
  /** Represents the hour value in the hour input element */
  @Input()
  get hour(): number | null {
    return this._hour;
  }
  set hour(value: number | null) {
    if (value === this._hour) {
      return;
    }

    this._hour = isDefined(value) ? coerceNumberProperty(value) : null;
    this._changeDetectorRef.markForCheck();
  }
  private _hour: number | null = null;
  static ngAcceptInputType_hour: NumberInput;

  /** Represents the minute value in the minute input element */
  @Input()
  get minute(): number | null {
    return this._minute;
  }
  set minute(value: number | null) {
    if (value === this._minute) {
      return;
    }
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

  /** Emits when the hour or minute value changed and the focus is not on the time input elements anymore. */
  @Output() timeChange = new EventEmitter<DtTimeChangeEvent>();

  /** @internal Reference of the hour input element */
  @ViewChild('hours', { read: ElementRef })
  _hourInput: ElementRef<HTMLInputElement>;

  /** @internal Reference of the minute input element */
  @ViewChild('minutes', { read: ElementRef })
  _minuteInput: ElementRef<HTMLInputElement>;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  /**
   * @internal
   * Emits the `time change` event.
   */
  _emitTimeChangeEvent(): void {
    const event = new DtTimeChangeEvent(this._hour || 0, this._minute || 0);
    this.timeChange.emit(event);
  }

  /**
   * @internal
   * Add the focus switch from the hour input to the minute input when the user typed in 2 digits.
   * Note: the nativeElement values are used here because otherwise the number values with leading zeros
   * would be converted to 1 digit (e.g. 05 would be 5), which would falsely evaluate as 1 digit numbers
   * and not switch the focus.
   */
  _onHourKeyUp(event: KeyboardEvent): void {
    const keyCode = _readKeyCode(event);
    if (
      keyCode !== SHIFT &&
      keyCode !== TAB &&
      hasMininmumTwoDigits(this._hourInput.nativeElement.value) &&
      !hasMininmumTwoDigits(this._minuteInput.nativeElement.value)
    ) {
      this._minuteInput.nativeElement.focus();
    }
  }

  /**
   * @internal
   * Called on blur and emits the timeChange event if the time inputs contain valid values.
   */
  _onInputBlur(origin: FocusOrigin): void {
    if (origin === null) {
      this._emitTimeChangeEvent();
    }
  }

  /**
   * @internal
   * Called on hour input blur and check the min - max limits to validate the hour.
   */
  _onHourInputBlur(): void {
    this._handleHourInputValidation(this.hour, this.minHour, this.maxHour);
  }

  /**
   * @internal
   * Called on minute input blur and check the min - max limits to validate the minute.
   */
  _onMinuteInputBlur(): void {
    this._handleMinuteInputValidation(
      this.minute,
      this.minMinute,
      this.maxMinute,
    );
  }

  /**
   * @internal Handler for the user's hour input events.
   * NOTE: If keydown event is used to prevent adding invalid input,
   * we cannot access the whole value, just the last typed character, hence why we use the input event on the input elements
   */
  _handleHourInput(event: InputEvent): void {
    const value = (event.currentTarget as HTMLInputElement).value;
    this._handleHourInputValidation(value);
  }

  /**
   * @internal Check if the hour input is valid and set the new value accordingly.
   */
  _handleHourInputValidation(
    value: string | number | null,
    min?: number | null,
    max?: number | null,
  ): void {
    if (isValidHour(value, min, max)) {
      this._hour = isString(value) ? parseInt(value, 10) : value;
    } else {
      // reset the value to something valid - use fallback value if it exists and the new value is not empty, otherwise reset to empty
      if (isEmpty(value)) {
        this._hour = null;
      }

      this._hourInput.nativeElement.value = !isEmpty(this._hour)
        ? clampHours(this._hour, this.minHour, this.maxHour)
        : '';
    }

    this._changeDetectorRef.markForCheck();
  }

  /** @internal Handler for the user's minute input events. */
  _handleMinuteInput(event: InputEvent): void {
    const value = (event.currentTarget as HTMLInputElement).value;
    this._handleMinuteInputValidation(value);
  }

  /**
   * @internal Check if the minute input is valid and set the new value accordingly.
   */
  _handleMinuteInputValidation(
    value: string | number | null,
    min?: number | null,
    max?: number | null,
  ): void {
    if (isValidMinute(value, min, max)) {
      this._minute = isString(value) ? parseInt(value, 10) : value;
    } else {
      if (isEmpty(value)) {
        this._minute = null;
      }

      this._minuteInput.nativeElement.value = !isEmpty(this._minute)
        ? clampMinutes(this._minute, this.minMinute, this.maxMinute)
        : '';
    }

    this._changeDetectorRef.markForCheck();
  }

  /**
   * @internal Prevent typing in '.', '+, and "-", since the input value will not reflect it on the change event
   * (the event target value does not include trailing '.' or "-" -> or it does not trigger any event in case the user types in "-" for example)
   */
  _handleKeydown(event: KeyboardEvent): boolean {
    return event.key !== '.' && event.key !== '-' && event.key !== '+';
  }

  /**
   * @internal Handle pasted values in the hour input, so that the user can paste a valid 'hh:mm' string (validated by regex)
   */
  _onTimePaste(event: ClipboardEvent): void {
    const pastedValue = event?.clipboardData?.getData('text');
    if (pastedValue && isPastedTimeValid(pastedValue)) {
      const [pastedHour, pastedMinute] = pastedValue.split(':');
      this._handleHourInputValidation(pastedHour);
      this._handleMinuteInputValidation(pastedMinute);
    }
  }
}
