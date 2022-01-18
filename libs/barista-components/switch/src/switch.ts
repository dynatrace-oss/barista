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
import {
  AfterViewInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Provider,
  ViewChild,
  ViewEncapsulation,
  forwardRef,
  Optional,
  Self,
  OnChanges,
} from '@angular/core';
import {
  CheckboxRequiredValidator,
  ControlValueAccessor,
  NG_VALIDATORS,
  NgControl,
} from '@angular/forms';

import {
  CanDisable,
  HasTabIndex,
  mixinDisabled,
  mixinTabIndex,
  _addCssClass,
  _removeCssClass,
} from '@dynatrace/barista-components/core';
import { DtFormFieldControl } from '@dynatrace/barista-components/form-field';
import { Subject } from 'rxjs';

// Increasing integer for generating unique ids for switch components.
let nextUniqueId = 0;

/** Change event object emitted by DtSwitch */
export interface DtSwitchChange<T> {
  source: DtSwitch<T>;
  checked: boolean;
}

// Boilerplate for applying mixins to DtSwitch.
export class DtSwitchBase {}
export const _DtSwitchMixinBase = mixinTabIndex(mixinDisabled(DtSwitchBase));

@Component({
  selector: 'dt-switch',
  templateUrl: 'switch.html',
  styleUrls: ['switch.scss'],
  exportAs: 'dtSwitch',
  inputs: ['disabled', 'tabIndex'],
  host: {
    class: 'dt-switch',
    '[id]': 'id',
    '[class.dt-switch-checked]': 'checked',
    '[class.dt-switch-disabled]': 'disabled',
    '(focus)': '_inputElement.nativeElement.focus()',
  },
  providers: [{ provide: DtFormFieldControl, useExisting: DtSwitch }],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtSwitch<T>
  extends _DtSwitchMixinBase
  implements
    CanDisable,
    HasTabIndex,
    OnDestroy,
    OnChanges,
    AfterViewInit,
    ControlValueAccessor,
    DtFormFieldControl<T>
{
  /** Whether or not the switch is checked. */
  @Input()
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    const coercedValue = coerceBooleanProperty(value);
    if (coercedValue !== this._checked) {
      this._checked = coercedValue;
      this.stateChanges.next();
      this._changeDetectorRef.markForCheck();
    }
  }
  static ngAcceptInputType_checked: BooleanInput;

  /** Unique id of the element. */
  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
  }

  /** Whether the switch is required. */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }
  static ngAcceptInputType_required: BooleanInput;

  /**
   * Whether the switch is disabled. This fully overrides the implementation provided by
   * mixinDisabled, but the mixin is still required because mixinTabIndex requires it.
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    if (value !== this.disabled) {
      this._disabled = coerceBooleanProperty(value);
      this._changeDetectorRef.markForCheck();
    }
  }
  static ngAcceptInputType_disabled: BooleanInput;

  /** Name value will be applied to the input element if present */
  @Input() name: string | null = null;

  /** The value attribute of the native input element */
  @Input() value: T;

  /** The 'aria-labelledby' attribute takes precedence as the element's text alternative. */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('aria-label') ariaLabel = '';

  /** The 'aria-describedby' attribute is read after the element's label and field type. */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('aria-labelledby') ariaLabelledby: string | null = null;

  /** Event emitted when the switch's `checked` value changes. */
  // Disabling no-output-native rule because we want to keep a similar API to the checkbox
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() readonly change = new EventEmitter<DtSwitchChange<T>>();

  /** @internal The native switch input element */
  @ViewChild('input', { static: true }) _inputElement: ElementRef;

  /** Returns the unique id for the visual hidden input. */
  get inputId(): string {
    return `${this.id}-input`;
  }

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

  /** @internal Implemented as part of the ControlValueAccessor */
  _onTouched: () => void = () => {};

  /** @internal The aria-describedby attribute on the input for improved a11y. */
  _ariaDescribedby: string;

  private _checked = false;
  private _uid = `dt-switch-${nextUniqueId++}`;
  private _id: string;
  private _required: boolean;
  private _disabled = false;
  private _controlValueAccessorChangeFn: (value: boolean) => void = () => {};

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
    @Attribute('tabindex') tabIndex: string,
    @Optional() @Self() public ngControl: NgControl,
  ) {
    super();

    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    // Force setter to be called in case id was not specified.
    // eslint-disable-next-line no-self-assign
    this.id = this.id;
    this.tabIndex = parseInt(tabIndex, 10) || 0;
  }

  ngAfterViewInit(): void {
    this._focusMonitor
      .monitor(this._inputElement.nativeElement, false)
      .subscribe((focusOrigin) => {
        this._onInputFocusChange(focusOrigin);
      });
  }

  ngOnChanges(): void {
    this.stateChanges.next();
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._inputElement.nativeElement);
  }

  /** Toggles the checked state of the switch */
  toggle(): void {
    this.checked = !this.checked;
  }

  /** @internal Handles clicking the hidden input element */
  _handleInputClick(event: Event): void {
    // We have to stop propagation for click events on the visual hidden input element.
    // Otherwise this will lead to multiple click events.
    event.stopPropagation();
  }

  /** @internal Handles the input change event */
  _handleInputChange(event: Event): void {
    // We always have to stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();

    this.checked = this._inputElement.nativeElement.checked;

    // Emit our custom change event only if the underlying input emitted one. This ensures that
    // there is no change event, when the checked state changes programmatically.
    this._emitChangeEvent();
  }

  /** @internal Transforms the checked state to a string so it can be set as aria-checked. */
  _getAriaChecked(): 'true' | 'false' {
    return this.checked ? 'true' : 'false';
  }

  /** Implemented as a part of ControlValueAccessor. */
  writeValue(value: boolean): void {
    this.checked = !!value;
  }

  /** Implemented as a part of ControlValueAccessor. */
  registerOnChange(fn: (value: boolean) => void): void {
    this._controlValueAccessorChangeFn = fn;
  }

  /** Implemented as a part of ControlValueAccessor. */
  registerOnTouched(fn: () => void = () => {}): void {
    this._onTouched = fn;
  }

  /** Implemented as a part of ControlValueAccessor. */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
  }

  /** Focuses the slide-toggle. */
  focus(): void {
    this._focusMonitor.focusVia(this._inputElement.nativeElement, 'keyboard');
  }

  /** Implemented as part of DtFormFieldControl. */
  setDescribedByIds(ids: string[]): void {
    this._ariaDescribedby = ids.join(' ');
  }

  /** Implemented as part of DtFormFieldControl. */
  onContainerClick(): void {
    this.focus();
  }

  /** @internal Callback for the cases where the focused state of the input changes. */
  _focusChanged(isFocused: boolean): void {
    if (isFocused !== this.focused) {
      this.focused = isFocused;
      this.stateChanges.next();
    }
  }

  private _onInputFocusChange(focusOrigin: FocusOrigin): void {
    const element = this._elementRef.nativeElement;

    if (focusOrigin === 'keyboard') {
      _addCssClass(element, 'dt-switch-focused');
    } else if (!focusOrigin) {
      _removeCssClass(element, 'dt-switch-focused');
      this._onTouched();
    }
  }

  private _emitChangeEvent(): void {
    this._controlValueAccessorChangeFn(this.checked);
    this.change.emit({ source: this, checked: this.checked });
  }
}

export const DT_SWITCH_REQUIRED_VALIDATOR: Provider = {
  provide: NG_VALIDATORS,
  // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define, @angular-eslint/no-forward-ref
  useExisting: forwardRef(() => DtSwitchRequiredValidator),
  multi: true,
};

/**
 * Validator for checkbox's required attribute in template-driven checkbox.
 * TODO @alexfrasst: Remove once CheckboxRequiredValidator supports custom checkbox
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: `dt-switch[required][formControlName],
             dt-switch[required][formControl], dt-switch[required][ngModel]`,
  exportAs: 'dtSwitchRequiredValidator',
  providers: [DT_SWITCH_REQUIRED_VALIDATOR],
  host: { '[attr.required]': 'required ? "" : null' },
})
export class DtSwitchRequiredValidator extends CheckboxRequiredValidator {}
