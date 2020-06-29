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

import { FocusOrigin } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
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
  _readKeyCode,
} from '@dynatrace/barista-components/core';
import {
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

    this._hour = value;
    this._changeDetectorRef.markForCheck();
  }
  private _hour: number | null = null;

  /** Represents the minute value in the minute input element */
  @Input()
  get minute(): number | null {
    return this._minute;
  }
  set minute(value: number | null) {
    if (value === this._minute) {
      return;
    }

    this._minute = value;
    this._changeDetectorRef.markForCheck();
  }
  private _minute: number | null = null;

  /** Binding for the disabled state. */
  @Input()
  get disabled(): boolean {
    return this._isDisabled;
  }
  set disabled(disabled: boolean) {
    this._isDisabled = coerceBooleanProperty(disabled);
    this._changeDetectorRef.markForCheck();
  }
  private _isDisabled: boolean = false;

  /** Emits when the hour or minute value changed and the focus is not on the time input elements anymore. */
  @Output() timeChange = new EventEmitter<DtTimeChangeEvent>();

  /** @internal Reference of the hour input element */
  @ViewChild('hours', { read: ElementRef }) _hourInput: ElementRef<
    HTMLInputElement
  >;

  /** @internal Reference of the minute input element */
  @ViewChild('minutes', { read: ElementRef }) _minuteInput: ElementRef<
    HTMLInputElement
  >;

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
   */
  _onHourKeyUp(event: KeyboardEvent): void {
    const keyCode = _readKeyCode(event);
    if (
      keyCode !== SHIFT &&
      keyCode !== TAB &&
      hasMininmumTwoDigits(this._hour) &&
      !hasMininmumTwoDigits(this._minute)
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
  _handleHourInputValidation(value: string): void {
    if (isValidHour(value)) {
      this._hour = parseInt(value, 10);
    } else {
      // reset the value to something valid - use fallback value if it exists and the new value is not empty, otherwise reset to empty
      if (isEmpty(value)) {
        this._hour = null;
      }

      this._hourInput.nativeElement.value = isDefined(this._hour)
        ? `${this._hour}`
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
  _handleMinuteInputValidation(value: string): void {
    if (isValidMinute(value)) {
      this._minute = parseInt(value, 10);
    } else {
      if (isEmpty(value)) {
        this._minute = null;
      }
      this._minuteInput.nativeElement.value = isDefined(this._minute)
        ? `${this._minute}`
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
