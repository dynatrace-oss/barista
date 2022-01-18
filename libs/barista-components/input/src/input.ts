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
import { Platform, getSupportedInputTypes } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';
import {
  Directive,
  DoCheck,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

import {
  CanUpdateErrorState,
  ErrorStateMatcher,
  mixinErrorState,
} from '@dynatrace/barista-components/core';
import { DtFormFieldControl } from '@dynatrace/barista-components/form-field';

let nextUniqueId = 0;

// Valid input type. Using one other than these will throw an error.
const INPUT_VALID_TYPES = [
  'color',
  'date',
  'datetime-local',
  'email',
  'month',
  'number',
  'password',
  'search',
  'tel',
  'text',
  'time',
  'url',
  'week',
];

// Boilerplate for applying mixins to DtInput.
export class DtInputBase {
  constructor(
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl,
  ) {}
}
export const _DtInputMixinBase = mixinErrorState(DtInputBase);

@Directive({
  selector: `input[dtInput], textarea[dtInput]`,
  exportAs: 'dtInput',
  host: {
    class: 'dt-input',
    '[class.dt-input-invalid]': 'errorState',
    '[attr.id]': 'id',
    '[placeholder]': 'placeholder',
    '[disabled]': 'disabled',
    '[required]': 'required',
    '[readonly]': 'readonly',
    '[attr.aria-describedby]': '_ariaDescribedby || null',
    '[attr.aria-invalid]': 'errorState',
    '[attr.aria-required]': 'required.toString()',
    '(input)': '_onInput()',
    '(blur)': '_focusChanged(false)',
    '(focus)': '_focusChanged(true)',
  },
  providers: [{ provide: DtFormFieldControl, useExisting: DtInput }],
})
export class DtInput
  extends _DtInputMixinBase
  implements
    DoCheck,
    OnInit,
    OnChanges,
    OnDestroy,
    CanUpdateErrorState,
    DtFormFieldControl<string>
{
  /** Implemented as part of DtFormFieldControl. */
  focused = false;

  /** Implemented as part of DtFormFieldControl. */
  readonly stateChanges = new Subject<void>();

  /** Implemented as part of DtFormFieldControl. */
  autofilled = false;

  /** The id of the input element. */
  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
  }

  /** Whether the input is disabled. */
  @Input()
  get disabled(): boolean {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }

    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);

    // Browsers may not fire the blur event if the input is disabled too quickly.
    // Reset from here to ensure that the element doesn't become stuck.
    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }
  static ngAcceptInputType_disabled: BooleanInput;

  /** Whether the input is required. */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }
  static ngAcceptInputType_required: BooleanInput;

  /** The placeholder of the input element. */
  @Input() placeholder = '';

  /** Input type of the element. */
  @Input()
  get type(): string {
    return this._type;
  }
  set type(value: string) {
    this._type = value || 'text';
    this._validateType();

    // When using Angular inputs, developers are no longer able to set the properties on the native
    // input element. To ensure that bindings for `type` work, we need to sync the setter
    // with the native property. Textarea elements don't support the type property or attribute.
    if (!this._isTextarea() && getSupportedInputTypes().has(this._type)) {
      this._elementRef.nativeElement.type = this._type;
    }
  }

  /** The value of the input element */
  @Input()
  get value(): string {
    return this._elementRef.nativeElement.value;
  }
  set value(value: string) {
    if (value !== this.value) {
      this._elementRef.nativeElement.value = value;
      this.stateChanges.next();
    }
  }

  /** Whether the element is readonly. */
  @Input()
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value: boolean) {
    this._readonly = coerceBooleanProperty(value);
  }
  static ngAcceptInputType_readonly: BooleanInput;

  /** An object used to control when error messages are shown. */
  @Input() errorStateMatcher: ErrorStateMatcher;

  /** Implemented as part of DtFormFieldControl. */
  get empty(): boolean {
    return (
      !this._isNeverEmpty() &&
      !this._elementRef.nativeElement.value &&
      !this._isBadInput() &&
      !this.autofilled
    );
  }

  /** @internal The aria-describedby attribute on the input for improved a11y. */
  _ariaDescribedby: string;

  protected _neverEmptyInputTypes = [
    'date',
    'datetime',
    'datetime-local',
    'month',
    'time',
    'week',
  ].filter((t) => getSupportedInputTypes().has(t));

  private _uid = `dt-input-${nextUniqueId++}`;
  private _id: string;
  private _disabled = false;
  private _required = false;
  private _readonly = false;
  private _type = 'text';
  private _previousNativeValue: string;

  constructor(
    private _elementRef: ElementRef,
    private _platform: Platform,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    private _autofillMonitor: AutofillMonitor,
  ) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);

    // Force setter to be called in case id was not specified.
    // eslint-disable-next-line no-self-assign
    this.id = this.id;

    this._previousNativeValue = this.value;
  }

  ngOnInit(): void {
    this._autofillMonitor
      .monitor(this._elementRef.nativeElement)
      .subscribe((event) => {
        this.autofilled = event.isAutofilled;
        this.stateChanges.next();
      });
  }

  ngOnChanges(): void {
    this.stateChanges.next();
  }

  ngDoCheck(): void {
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean or we risk destroying the performance.
      this.updateErrorState();
    }

    // We need to dirty-check the native element's value, because there are some cases where
    // we won't be notified when it changes (e.g. the consumer isn't using forms or they're
    // updating the value using `emitEvent: false`).
    this._dirtyCheckNativeValue();
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement);
  }

  /** Focuses the input. */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }

  /** Implemented as part of DtFormFieldControl. */
  setDescribedByIds(ids: string[]): void {
    this._ariaDescribedby = ids.join(' ');
  }

  /** Implemented as part of DtFormFieldControl. */
  onContainerClick(): void {
    this.focus();
  }

  /** @internal Handles the input change - noop method */
  _onInput(): void {
    // _onInput is basically just a noop function to let change detection know
    // when the user types. Never remove this function, even if it's empty.
  }

  /** @internal Callback for the cases where the focused state of the input changes. */
  _focusChanged(isFocused: boolean): void {
    if (isFocused !== this.focused && !this.readonly) {
      this.focused = isFocused;
      this.stateChanges.next();
    }
  }

  /** Determines if the component host is a textarea. If not recognizable it returns false. */
  private _isTextarea(): boolean {
    const nativeElement = this._elementRef.nativeElement;

    // In Universal, we don't have access to `nodeName`, but the same can be achieved with `name`.
    const nodeName = this._platform.isBrowser
      ? nativeElement.nodeName
      : nativeElement.name;

    return nodeName ? nodeName.toLowerCase() === 'textarea' : false;
  }

  /** Make sure the input is a supported type. */
  private _validateType(): void {
    if (!INPUT_VALID_TYPES.includes(this._type)) {
      throw new Error(`Input type "${this._type}" isn't supported by dtInput.`);
    }
  }

  /** Does some manual dirty checking on the native input `value` property. */
  private _dirtyCheckNativeValue(): void {
    const newValue = this.value;

    if (this._previousNativeValue !== newValue) {
      this._previousNativeValue = newValue;
      this.stateChanges.next();
    }
  }

  /** Checks whether the input type is one of the types that are never empty. */
  protected _isNeverEmpty(): boolean {
    return this._neverEmptyInputTypes.indexOf(this._type) > -1;
  }

  /** Checks whether the input is invalid based on the native validation. */
  protected _isBadInput(): boolean {
    // The `validity` property won't be present on platform-server.
    const validity = (this._elementRef.nativeElement as HTMLInputElement)
      .validity;
    return validity && validity.badInput;
  }
}
