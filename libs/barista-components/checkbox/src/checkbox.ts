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

import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import {
  AfterViewInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Provider,
  Self,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  CheckboxRequiredValidator,
  ControlValueAccessor,
  NgControl,
  NG_VALIDATORS,
} from '@angular/forms';
import {
  CanDisable,
  HasTabIndex,
  mixinDisabled,
  mixinTabIndex,
  _addCssClass,
} from '@dynatrace/barista-components/core';
import { DtFormFieldControl } from '@dynatrace/barista-components/form-field';
import { Subject } from 'rxjs';

/**
 * Checkbox IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let nextUniqueId = 0;

/** Represents the different states that require custom transitions between them. */
// eslint-disable-next-line no-shadow
export const enum TransitionCheckState {
  /** The initial state of the component before any user interaction. */
  Init,
  /** The state representing the component when it's becoming checked. */
  Checked,
  /** The state representing the component when it's becoming unchecked. */
  Unchecked,
  /** The state representing the component when it's becoming indeterminate. */
  Indeterminate,
}

/** Change event object emitted by DtCheckbox */
export interface DtCheckboxChange<T> {
  source: DtCheckbox<T>;
  checked: boolean;
}

// Boilerplate for applying mixins to DtCheckbox.
export class DtCheckboxBase {}
export const _DtCheckboxMixinBase = mixinTabIndex(
  mixinDisabled(DtCheckboxBase),
);

@Component({
  selector: 'dt-checkbox',
  templateUrl: 'checkbox.html',
  styleUrls: ['checkbox.scss'],
  exportAs: 'dtCheckbox',
  host: {
    '[id]': 'id',
    class: 'dt-checkbox',
    '[class.dt-checkbox-checked]': 'checked',
    '[class.dt-checkbox-indeterminate]': 'indeterminate',
    '[class.dt-checkbox-disabled]': 'disabled',
    '(focus)': '_inputElement.nativeElement.focus()',
  },
  inputs: ['disabled', 'tabIndex'],
  providers: [{ provide: DtFormFieldControl, useExisting: DtCheckbox }],
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtCheckbox<T>
  extends _DtCheckboxMixinBase
  implements
    CanDisable,
    HasTabIndex,
    AfterViewInit,
    OnDestroy,
    OnInit,
    OnChanges,
    ControlValueAccessor,
    DtFormFieldControl<T>
{
  /** Whether or not the checkbox is checked. */
  @Input()
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    const coercedValue = coerceBooleanProperty(value);
    if (coercedValue !== this._checked) {
      this._checked = coercedValue;
      this._transitionCheckState(
        this._checked
          ? TransitionCheckState.Checked
          : TransitionCheckState.Unchecked,
      );
      this.stateChanges.next();
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Unique id of the element. */
  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
  }

  /** Whether the checkbox is required. */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }
  static ngAcceptInputType_required: BooleanInput;

  /**
   * Whether the checkbox is disabled. This fully overrides the implementation provided by
   * mixinDisabled, but the mixin is still required because mixinTabIndex requires it.
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    const coerced = coerceBooleanProperty(value);
    if (coerced !== this.disabled) {
      this._disabled = coerced;
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

  /**
   * Whether the checkbox is indeterminate. This is also known as "mixed" mode and can be used to
   * represent a checkbox with three states, e.g. a checkbox that represents a nested list of
   * checkable items. Note that whenever checkbox is manually clicked, indeterminate is immediately
   * set to false.
   */
  @Input()
  get indeterminate(): boolean {
    return this._indeterminate;
  }
  set indeterminate(value: boolean) {
    const changed = value !== this._indeterminate;
    this._indeterminate = value;

    if (changed) {
      if (this._indeterminate) {
        this._transitionCheckState(TransitionCheckState.Indeterminate);
      } else {
        this._transitionCheckState(
          this.checked
            ? TransitionCheckState.Checked
            : TransitionCheckState.Unchecked,
        );
      }
      this.indeterminateChange.emit(this._indeterminate);
    }
  }

  /** Event emitted when the checkbox's `checked` value changes. */
  // Disabling no-output-native rule because we want to keep a similar API to the native checkbox
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() readonly change = new EventEmitter<DtCheckboxChange<T>>();

  /** Event emitted when the checkbox's `indeterminate` value changes. */
  @Output() readonly indeterminateChange = new EventEmitter<boolean>();

  /** @internal The native radio input element */
  @ViewChild('input', { static: true }) _inputElement: ElementRef;

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

  /** @internal Returns the unique id for the visual hidden input. */
  get _inputId(): string {
    return `${this.id}-input`;
  }

  /** @internal Implemented as part of the ValueAccessor interface */
  _onTouched: () => void = () => {};

  /** @internal The aria-describedby attribute on the input for improved a11y. */
  _ariaDescribedby: string;

  private _checked = false;
  private _uid = `dt-checkbox-${nextUniqueId++}`;
  private _id: string;
  private _required: boolean;
  private _disabled = false;
  private _indeterminate = false;
  private _currentCheckState: TransitionCheckState = TransitionCheckState.Init;
  private _currentAnimationClass = '';
  private _controlValueAccessorChangeFn: (value: boolean) => void = () => {};

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
    private _platform: Platform,
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

  ngOnInit(): void {
    // We need to do the user agent check on JS side
    // because there is no css specific solution for EDGE
    if (this._platform.TRIDENT || this._platform.EDGE) {
      _addCssClass(
        this._elementRef.nativeElement,
        'dt-checkbox-animation-fallback',
      );
    }
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

  /** Focuses the checkbox. */
  focus(): void {
    this._focusMonitor.focusVia(this._inputElement.nativeElement, 'keyboard');
  }

  /** Toggles the `checked` state of the checkbox. */
  toggle(): void {
    this.checked = !this.checked;
  }

  /** Implemented as part of DtFormFieldControl. */
  setDescribedByIds(ids: string[]): void {
    this._ariaDescribedby = ids.join(' ');
  }

  /** Implemented as part of DtFormFieldControl. */
  onContainerClick(): void {
    this.focus();
  }

  /** @internal Handles the click on the input element. */
  _onInputClick(event: Event): void {
    // We have to stop propagation for click events on the visual hidden input element.
    // Otherwise this will lead to multiple click events.
    event.stopPropagation();

    if (!this.disabled) {
      if (this.indeterminate) {
        Promise.resolve().then(() => {
          this._indeterminate = false;
          this.indeterminateChange.emit(this._indeterminate);
        });
      }

      this.toggle();
      this._emitChangeEvent();
    }
  }

  /** @internal Handles the change on the input element. */
  _onInputChange(event: Event): void {
    // We always have to stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();
  }

  /** @internal Transforms the checked and indeterminate state to a string consumed by aria-checked. */
  _getAriaChecked(): 'true' | 'false' | 'mixed' {
    return this.checked ? 'true' : this.indeterminate ? 'mixed' : 'false';
  }

  /** @internal Callback for the cases where the focused state of the input changes. */
  _focusChanged(isFocused: boolean): void {
    if (isFocused !== this.focused) {
      this.focused = isFocused;
      this.stateChanges.next();
    }
  }

  /** Implemented as a part of ControlValueAccessor. */
  writeValue(value: boolean): void {
    this.checked = value;
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
  }

  private _onInputFocusChange(focusOrigin: FocusOrigin): void {
    const element = this._elementRef.nativeElement;

    if (focusOrigin === 'keyboard') {
      element.classList.add('dt-checkbox-focused');
    } else if (!focusOrigin) {
      element.classList.remove('dt-checkbox-focused');
      this._onTouched();
    }
  }

  private _emitChangeEvent(): void {
    this._controlValueAccessorChangeFn(this.checked);
    this.change.emit({ source: this, checked: this.checked });
  }

  private _transitionCheckState(newState: TransitionCheckState): void {
    const oldState = this._currentCheckState;
    const element: HTMLElement = this._elementRef.nativeElement;

    if (oldState === newState) {
      return;
    }
    if (this._currentAnimationClass.length > 0) {
      element.classList.remove(this._currentAnimationClass);
    }

    this._currentAnimationClass = getAnimationClassForCheckStateTransition(
      oldState,
      newState,
    );
    this._currentCheckState = newState;

    if (this._currentAnimationClass.length > 0) {
      element.classList.add(this._currentAnimationClass);
      if (newState === TransitionCheckState.Unchecked) {
        const animationClass = this._currentAnimationClass;
        const animationEndHandler = () => {
          element.classList.remove(animationClass);
          element.removeEventListener('animationend', animationEndHandler);
        };
        element.addEventListener('animationend', animationEndHandler);
      }
    }
  }
}

export const DT_CHECKBOX_REQUIRED_VALIDATOR: Provider = {
  provide: NG_VALIDATORS,
  // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define, @angular-eslint/no-forward-ref
  useExisting: forwardRef(() => DtCheckboxRequiredValidator),
  multi: true,
};

/**
 * Validator for checkbox's required attribute in template-driven checkbox.
 * TODO @thomaspink: Remove once CheckboxRequiredValidator supports custom checkbox
 */
@Directive({
  // Somehow the directive-selector eslint rule thinks the selector does not start with dt-
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: `dt-checkbox[required][formControlName],
             dt-checkbox[required][formControl], dt-checkbox[required][ngModel]`,
  exportAs: 'dtCheckboxRequiredValidator',
  providers: [DT_CHECKBOX_REQUIRED_VALIDATOR],
  host: { '[attr.required]': 'required ? "" : null' },
})
export class DtCheckboxRequiredValidator extends CheckboxRequiredValidator {}

function getAnimationClassForCheckStateTransition(
  oldState: TransitionCheckState,
  newState: TransitionCheckState,
): string {
  let animSuffix = '';

  switch (oldState) {
    case TransitionCheckState.Init:
      // Handle edge case where user interacts with checkbox that does not have [(ngModel)] or
      // [checked] bound to it.
      if (newState === TransitionCheckState.Checked) {
        animSuffix = 'unchecked-checked';
      } else if (newState === TransitionCheckState.Indeterminate) {
        animSuffix = 'unchecked-indeterminate';
      } else {
        return '';
      }
      break;
    case TransitionCheckState.Unchecked:
      animSuffix =
        newState === TransitionCheckState.Checked
          ? 'unchecked-checked'
          : 'unchecked-indeterminate';
      break;
    case TransitionCheckState.Checked:
      animSuffix =
        newState === TransitionCheckState.Unchecked
          ? 'checked-unchecked'
          : 'checked-indeterminate';
      break;
    case TransitionCheckState.Indeterminate:
      animSuffix =
        newState === TransitionCheckState.Checked
          ? 'indeterminate-checked'
          : 'indeterminate-unchecked';
      break;
    default:
  }

  return `dt-checkbox-anim-${animSuffix}`;
}
