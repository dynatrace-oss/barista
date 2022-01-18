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

import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChildren,
  Directive,
  EventEmitter,
  forwardRef,
  Input,
  Optional,
  Output,
  QueryList,
  Self,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { CanDisable } from '@dynatrace/barista-components/core';
import { DtFormFieldControl } from '@dynatrace/barista-components/form-field';
import { Subject } from 'rxjs';
import { DtRadioButton, DtRadioChange } from './radio';

let nextUniqueId = 0;

@Directive({
  selector: 'dt-radio-group, [dtRadioGroup]',
  exportAs: 'dtRadioGroup',
  providers: [{ provide: DtFormFieldControl, useExisting: DtRadioGroup }],
  host: {
    role: 'radiogroup',
    class: 'dt-radio-group',
    '[attr.aria-describedby]': '_ariaDescribedby',
  },
  inputs: ['disabled'],
})
export class DtRadioGroup<T>
  implements
    AfterContentInit,
    CanDisable,
    ControlValueAccessor,
    DtFormFieldControl<T>
{
  private _value: T | null = null;
  private _name = `dt-radio-group-${nextUniqueId++}`;
  private _selected: DtRadioButton<T> | null = null;
  private _disabled = false;
  private _required = false;
  private _isInitialized = false;

  /** Name of the radio button group. All radio buttons inside this group will use this name. */
  @Input()
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
    this._updateRadioButtonNames();
  }

  /** Value of the radio button. */
  @Input()
  get value(): T | null {
    return this._value;
  }
  set value(newValue: T | null) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._updateSelectedRadioFromValue();
      this._checkSelectedRadioButton();
      this.stateChanges.next();
    }
  }

  /** Whether the radio button is selected. */
  @Input()
  get selected(): DtRadioButton<T> | null {
    return this._selected;
  }
  set selected(selected: DtRadioButton<T> | null) {
    this._selected = selected;
    this.value = selected ? selected.value : null;
    this._checkSelectedRadioButton();
    this.stateChanges.next();
  }

  /** Whether the radio group is disabled */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._markRadiosForCheck();
  }
  static ngAcceptInputType_disabled: BooleanInput;

  /** Whether the radio group is required */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this._markRadiosForCheck();
  }
  static ngAcceptInputType_required: BooleanInput;

  /** Unique id of the element. */
  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._name;
  }
  private _id: string;

  /** Emits when a radio of this group is changed. */
  // Disabling no-output-native rule because we want to keep a similar API to the native radio group
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() readonly change = new EventEmitter<DtRadioChange<T>>();

  /** Implemented as part of DtFormFieldControl. */
  readonly stateChanges = new Subject<void>();

  /** Implemented as part of DtFormFieldControl. */
  focused = false;

  /** Implemented as part of DtFormFieldControl. */
  empty = false;

  /** Implemented as part of DtFormFieldControl. */
  errorState = false;

  /** @internal Implemented as part of DtFormFieldControl. */
  _boxControl = false;

  /** @internal The aria-describedby attribute on the input for improved a11y. */
  _ariaDescribedby: string;

  /**
   * @internal Part of the ControlValueAccessor interface.
   */
  _onTouched: () => void = () => {};

  /** @internal The method to be called in order to update ngModel */
  _controlValueAccessorChangeFn: (value: T) => void = () => {};

  /** @internal References to the radio buttons of this group. */
  // eslint-disable-next-line @angular-eslint/no-forward-ref
  @ContentChildren(forwardRef(() => DtRadioButton), { descendants: true })
  _radios: QueryList<DtRadioButton<T>>;

  constructor(
    private _changeDetector: ChangeDetectorRef,
    @Optional() @Self() public ngControl: NgControl,
  ) {
    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    // Force setter to be called in case id was not specified.
    // eslint-disable-next-line no-self-assign
    this.id = this.id;
  }

  ngAfterContentInit(): void {
    // Mark this component as initialized in AfterContentInit because the initial value can
    // possibly be set by NgModel on DtRadioGroup, and it is possible that the OnInit of the
    // NgModel occurs *after* the OnInit of the DtRadioGroup.
    this._isInitialized = true;
  }

  focus(): void {
    if (this._radios.first) {
      this._radios.first.focus();
    }
  }

  /** @internal Checks the selected radio button */
  _checkSelectedRadioButton(): void {
    if (this._selected && !this._selected.checked) {
      this._selected.checked = true;
    }
  }

  /** @internal Called when the control is touched. */
  _touch(): void {
    if (this._onTouched) {
      this._onTouched();
    }
  }

  /** @internal Dispatch change event with current selection and group value. */
  _emitChangeEvent(): void {
    if (this._isInitialized) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.change.emit({ source: this._selected!, value: this._value });
    }
  }

  /** Implemented as a part of ControlValueAccessor. */
  writeValue(value: T): void {
    this.value = value;
    this._changeDetector.markForCheck();
  }

  /** Implemented as a part of ControlValueAccessor. */
  registerOnChange(fn: (value: T) => void): void {
    this._controlValueAccessorChangeFn = fn;
  }

  /** Implemented as a part of ControlValueAccessor. */
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  /** Implemented as a part of ControlValueAccessor. */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetector.markForCheck();
  }

  /** Implemented as part of DtFormFieldControl. */
  setDescribedByIds(ids: string[]): void {
    this._ariaDescribedby = ids.join(' ');
  }

  /** Implemented as part of DtFormFieldControl. */
  onContainerClick(): void {
    this.focus();
  }

  _updateFocused(): void {
    this.focused = this._radios.some((radio) => radio._focused);
    this._changeDetector.markForCheck();
  }

  private _markRadiosForCheck(): void {
    if (this._radios) {
      this._radios.forEach((radio) => {
        radio._markForCheck();
      });
    }
  }

  /** Set the name of every radio button to the groups name */
  private _updateRadioButtonNames(): void {
    if (this._radios) {
      this._radios.forEach((radio) => {
        radio.name = this.name;
      });
    }
  }

  /** Updates the `selected` state of each radio button based on the groups value. */
  private _updateSelectedRadioFromValue(): void {
    if (
      this._radios &&
      !(this._selected !== null && this._selected.value === this._value)
    ) {
      this._selected = null;
      this._radios.forEach((radio) => {
        radio.checked = this.value === radio.value;
        if (radio.checked) {
          this._selected = radio;
        }
      });
    }
  }
}
