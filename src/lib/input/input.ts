import {
  Directive,
  Input,
  Optional,
  Self,
  OnChanges,
  OnDestroy,
  ElementRef,
  DoCheck
} from '@angular/core';
import { NgControl, NgForm, FormGroupDirective } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform, getSupportedInputTypes } from '@angular/cdk/platform';
import { Subject } from 'rxjs/Subject';
import {
  ErrorStateMatcher,
  mixinErrorState,
  CanUpdateErrorState
} from '@dynatrace/angular-components/core';

let nextUniqueId = 0;

// Invalid input type. Using one of these will throw an error.
const INPUT_INVALID_TYPES = [
  'button',
  'checkbox',
  'file',
  'hidden',
  'image',
  'radio',
  'range',
  'reset',
  'submit',
];

const NEVER_EMPTY_INPUT_TYPES = [
  'date',
  'datetime',
  'datetime-local',
  'month',
  'time',
  'week',
].filter((t) => getSupportedInputTypes().has(t));

// Boilerplate for applying mixins to DtInput.
export class DtInputBase {
  constructor(
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl) { }
}
export const _DtInputMixinBase = mixinErrorState(DtInputBase);

@Directive({
  selector: `input[dtInput], textarea[dtInput]`,
  exportAs: 'dtInput',
  host: {
    'class': 'dt-input',
    '[class.dt-input-invalid]': 'errorState',
    '[attr.id]': 'id',
    '[placeholder]': 'placeholder',
    '[disabled]': 'disabled',
    '[required]': 'required',
    '[readonly]': 'readonly',
    '[attr.aria-describedby]': '_ariaDescribedby || null',
    '[attr.aria-invalid]': 'errorState',
    '[attr.aria-required]': 'required.toString()',
    '(blur)': '_focusChanged(false)',
    '(focus)': '_focusChanged(true)',
    '(input)': '_onInput()',
  },
})
export class DtInput extends _DtInputMixinBase implements DoCheck, CanUpdateErrorState {

  @Input()
  get id(): string { return this._id; }
  set id(value: string) { this._id = value || this._uid; }

  @Input()
  get disabled(): boolean {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }

    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }

  @Input()
  get required(): boolean { return this._required; }
  set required(value: boolean) { this._required = coerceBooleanProperty(value); }

  @Input() placeholder = '';

  /** Input type of the element. */
  @Input()
  get type(): string { return this._type; }
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

  @Input()
  get value(): string { return this._elementRef.nativeElement.value; }
  set value(value: string) {
    if (value !== this.value) {
      this._elementRef.nativeElement.value = value;
      this.stateChanges.next();
    }
  }

  /** Whether the element is readonly. */
  @Input()
  get readonly(): boolean { return this._readonly; }
  set readonly(value: boolean) { this._readonly = coerceBooleanProperty(value); }
  private _readonly = false;

  /** An object used to control when error messages are shown. */
  @Input() errorStateMatcher: ErrorStateMatcher;

  /** The aria-describedby attribute on the input for improved a11y. */
  _ariaDescribedby: string;

  private _uid = `dt-input-${nextUniqueId++}`;
  private _id: string;
  private _disabled = false;
  private _required = false;
  private _type = 'text';
  private _previousNativeValue: string;

  constructor(
    private _elementRef: ElementRef,
    private _platform: Platform,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher
  ) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);

    // Force setter to be called in case id was not specified.
    this.id = this.id;

    this._previousNativeValue = this.value;
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

  /** Focuses the input. */
  focus(): void { this._elementRef.nativeElement.focus(); }

  _onInput(): void {
    // _onInput is basically just a noop function to let change detection know
    // when the user types. Never remove this function, even if it's empty.
  }

  /** Determines if the component host is a textarea. If not recognizable it returns false. */
  private _isTextarea(): boolean {
    const nativeElement = this._elementRef.nativeElement;

    // In Universal, we don't have access to `nodeName`, but the same can be achieved with `name`.
    const nodeName = this._platform.isBrowser ? nativeElement.nodeName : nativeElement.name;

    return nodeName ? nodeName.toLowerCase() === 'textarea' : false;
  }

  /** Make sure the input is a supported type. */
  private _validateType(): void {
    if (INPUT_INVALID_TYPES.indexOf(this._type) > -1) {
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
  private _isNeverEmpty(): boolean {
    return NEVER_EMPTY_INPUT_TYPES.indexOf(this._type) !== -1;
  }

  /** Checks whether the input is invalid based on the native validation. */
  protected _isBadInput(): boolean {
    // The `validity` property won't be present on platform-server.
    const validity = (this._elementRef.nativeElement as HTMLInputElement).validity;

    return validity && validity.badInput;
  }

}
