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

import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import {
  CanDisable,
  HasTabIndex,
  _addCssClass,
  mixinTabIndex,
  _removeCssClass,
} from '@dynatrace/barista-components/core';

import { DtRadioGroup } from './radio-group';

let nextUniqueId = 0;

/** Change event object emitted by DtRadioButton */
export interface DtRadioChange<T> {
  source: DtRadioButton<T>;
  value: T | null;
}

// Boilerplate for applying mixins to DtRadioButton.
export class DtRadioButtonBase {
  private _disabled: boolean;

  // These must be properties instead of fields to avoid a TS error
  // see https://github.com/microsoft/TypeScript/pull/37894
  /** Whether the radio button is disabled */
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
  }
}
export const _DtRadioButtonMixinBase = mixinTabIndex(DtRadioButtonBase);

@Component({
  selector: 'dt-radio-button',
  exportAs: 'dtRadioButton',
  templateUrl: 'radio.html',
  styleUrls: ['radio.scss'],
  inputs: ['tabIndex'],
  host: {
    class: 'dt-radio-button',
    '[class.dt-radio-checked]': 'checked',
    '[class.dt-radio-disabled]': 'disabled',
    '[attr.id]': 'id',
    '(focus)': '_inputElement.nativeElement.focus()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
})
export class DtRadioButton<T>
  extends _DtRadioButtonMixinBase
  implements OnInit, AfterViewInit, OnDestroy, CanDisable, HasTabIndex
{
  private _uniqueId = `dt-radio-${++nextUniqueId}`;
  private _required: boolean;
  private _checked = false;
  private _value: T;
  private _removeUniqueSelectionListener: () => void = () => {};

  /** The unique ID for the radio button. */
  @Input() id: string = this._uniqueId;

  /** Whether the radio button is required. */
  @Input()
  get required(): boolean {
    return this._required || (this._radioGroup && this._radioGroup.required);
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }
  static ngAcceptInputType_required: BooleanInput;

  /** Whether the radio button is disabled. */
  @Input()
  get disabled(): boolean {
    return super.disabled || (this._radioGroup && this._radioGroup.disabled);
  }
  set disabled(value: boolean) {
    const newDisabledState = coerceBooleanProperty(value);
    if (super.disabled !== newDisabledState) {
      super.disabled = newDisabledState;
      this._changeDetector.markForCheck();
    }
  }
  static ngAcceptInputType_disabled: BooleanInput;

  /** Whether this radio button is checked. */
  @Input()
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    const newCheckedState = coerceBooleanProperty(value);

    if (this._checked !== newCheckedState) {
      this._checked = newCheckedState;

      if (
        newCheckedState &&
        this._radioGroup &&
        this._radioGroup.value !== this.value
      ) {
        this._radioGroup.selected = this;
      } else if (
        !newCheckedState &&
        this._radioGroup &&
        this._radioGroup.value === this.value
      ) {
        // When unchecking the selected radio button, update the selected radio
        // property on the group.
        this._radioGroup.selected = null;
      }

      if (newCheckedState) {
        // Notify all radio buttons with the same name to un-check.
        this._radioDispatcher.notify(this.id, this.name);
      }
      this._changeDetector.markForCheck();
    }
  }
  static ngAcceptInputType_checked: BooleanInput;

  /** The value of this radio button. */
  @Input()
  get value(): T {
    return this._value;
  }
  set value(value: T) {
    if (this._value !== value) {
      this._value = value;
      if (this._radioGroup) {
        if (!this.checked) {
          // Update checked when the value changed to match the radio group's value
          this.checked = this._radioGroup.value === value;
        }
        if (this.checked) {
          this._radioGroup.selected = this;
        }
      }
    }
  }

  /** Analog to HTML 'name' attribute used to group radios for unique selection. */
  @Input() name: string;

  /** Used to set the 'aria-label' attribute on the underlying input element. */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('aria-label') ariaLabel: string;

  /** The 'aria-labelledby' attribute takes precedence as the element's text alternative. */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('aria-labelledby') ariaLabelledby: string;

  /** The 'aria-describedby' attribute is read after the element's label and field type. */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('aria-describedby') ariaDescribedby: string;

  /** Emits when this radio button becomes selected or not. */
  // Disabling no-output-native rule because we want to keep a similar API to the native radio button
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() readonly change = new EventEmitter<DtRadioChange<T>>();

  /** @internal ID of the native input element */
  get _inputId(): string {
    return `${this.id || this._uniqueId}-input`;
  }

  /** @internal The native radio input element */
  @ViewChild('input', { static: true }) _inputElement: ElementRef;

  /** @internal Whether the radio is currently focused */
  _focused = false;

  constructor(
    private _elementRef: ElementRef,
    private _changeDetector: ChangeDetectorRef,
    private _radioDispatcher: UniqueSelectionDispatcher,
    private _focusMonitor: FocusMonitor,
    @Optional() private _radioGroup: DtRadioGroup<T>,
  ) {
    super();
    this._removeUniqueSelectionListener = _radioDispatcher.listen(
      (id: string, name: string) => {
        if (id !== this.id && name === this.name) {
          this.checked = false;
        }
      },
    );
  }

  ngOnInit(): void {
    if (this._radioGroup) {
      this.name = this._radioGroup.name;
      this.checked = this._radioGroup.value === this._value;
    }
  }

  ngAfterViewInit(): void {
    this._focusMonitor
      .monitor(this._inputElement.nativeElement, false)
      .subscribe((focusOrigin) => {
        this._onInputFocusChange(focusOrigin);
      });
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._inputElement.nativeElement);
    this._removeUniqueSelectionListener();
  }

  /** Focuses the radio button. */
  focus(): void {
    this._focusMonitor.focusVia(this._inputElement.nativeElement, 'keyboard');
  }

  /** @internal Callback for the cases where the focused state of the input changes. */
  _focusChanged(isFocused: boolean): void {
    if (isFocused !== this._focused) {
      this._focused = isFocused;
      if (this._radioGroup) {
        this._radioGroup._updateFocused();
      }
    }
  }

  /** @internal Handles the click on the hidden radio input. */
  _onInputClick(event: Event): void {
    // We have to stop propagation for click events on the visual hidden input element.
    // Otherwise this will lead to multiple click events.
    event.stopPropagation();
  }

  /** @internal Handles the input change of the hidden radio input. */
  _onInputChange(event: Event): void {
    // We always have to stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();

    const groupValueChanged =
      this._radioGroup && this.value !== this._radioGroup.value;
    this.checked = true;
    this._emitChangeEvent();

    if (this._radioGroup) {
      this._radioGroup._controlValueAccessorChangeFn(this.value);
      this._radioGroup._touch();
      if (groupValueChanged) {
        this._radioGroup._emitChangeEvent();
      }
    }
  }

  /** @internal Marks the radio button to be checked in the next CD cycle */
  _markForCheck(): void {
    this._changeDetector.markForCheck();
  }

  /** Dispatch change event with current value. */
  private _emitChangeEvent(): void {
    this.change.emit({ source: this, value: this._value });
  }

  private _onInputFocusChange(focusOrigin: FocusOrigin): void {
    const element = this._elementRef.nativeElement;

    if (focusOrigin === 'keyboard') {
      _addCssClass(element, 'dt-radio-focused');
    } else if (!focusOrigin) {
      _removeCssClass(element, 'dt-radio-focused');
      if (this._radioGroup) {
        this._radioGroup._touch();
      }
    }
  }
}
