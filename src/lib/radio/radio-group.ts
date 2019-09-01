import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChildren,
  Directive,
  EventEmitter,
  Input,
  Output,
  QueryList,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { CanDisable } from '@dynatrace/angular-components/core';

import { DtRadioButton, DtRadioChange } from './radio';

let nextUniqueId = 0;

@Directive({
  selector: 'dt-radio-group',
  exportAs: 'dtRadioGroup',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // tslint:disable-next-line:no-forward-ref
      useExisting: forwardRef(() => DtRadioGroup),
      multi: true,
    },
  ],
  host: {
    role: 'radiogroup',
    class: 'dt-radio-group',
  },
  inputs: ['disabled'],
})
export class DtRadioGroup<T> implements AfterContentInit, CanDisable {
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

  /** Whether the radio group is required */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this._markRadiosForCheck();
  }

  /** Emits when a radio of this group is changed. */
  // Disabling no-output-native rule because we want to keep a similar API to the native radio group
  // tslint:disable-next-line: no-output-native
  @Output() readonly change = new EventEmitter<DtRadioChange<T>>();

  /** @internal Part of the ControlValueAccessor interface. */
  onTouched: () => void = () => {};

  /** @internal The method to be called in order to update ngModel */
  _controlValueAccessorChangeFn: (value: T) => void = () => {};

  /** @internal References to the radio buttons of this group. */
  // tslint:disable-next-line:no-forward-ref
  @ContentChildren(forwardRef(() => DtRadioButton), { descendants: true })
  _radios: QueryList<DtRadioButton<T>>;

  constructor(private _changeDetector: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    // Mark this component as initialized in AfterContentInit because the initial value can
    // possibly be set by NgModel on DtRadioGroup, and it is possible that the OnInit of the
    // NgModel occurs *after* the OnInit of the DtRadioGroup.
    this._isInitialized = true;
  }

  /** @internal Checks the selected radio button */
  _checkSelectedRadioButton(): void {
    if (this._selected && !this._selected.checked) {
      this._selected.checked = true;
    }
  }

  /** @internal Called when the control is touched. */
  _touch(): void {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  /** @internal Dispatch change event with current selection and group value. */
  _emitChangeEvent(): void {
    if (this._isInitialized) {
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
    this.onTouched = fn;
  }

  /** Implemented as a part of ControlValueAccessor. */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetector.markForCheck();
  }

  private _markRadiosForCheck(): void {
    if (this._radios) {
      this._radios.forEach(radio => {
        radio._markForCheck();
      });
    }
  }

  /** Set the name of every radio button to the groups name */
  private _updateRadioButtonNames(): void {
    if (this._radios) {
      this._radios.forEach(radio => {
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
      this._radios.forEach(radio => {
        radio.checked = this.value === radio.value;
        if (radio.checked) {
          this._selected = radio;
        }
      });
    }
  }
}
