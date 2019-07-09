import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnDestroy,
  AfterViewInit,
  Provider,
  forwardRef,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  ElementRef,
  Attribute,
  ChangeDetectorRef,
  Directive,
  Renderer2,
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusOrigin, FocusMonitor } from '@angular/cdk/a11y';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  CheckboxRequiredValidator,
} from '@angular/forms';
import {
  HasTabIndex,
  CanDisable,
  mixinTabIndex,
  mixinDisabled,
} from '@dynatrace/angular-components/core';

// Increasing integer for generating unique ids for switch components.
let nextUniqueId = 0;

/**
 * Provider Expression that allows dt-switch to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 */
export const DT_SWITCH_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare no-forward-ref
  useExisting: forwardRef(() => DtSwitch),
  multi: true,
};

/** Change event object emitted by DtSwitch */
export interface DtSwitchChange<T> {
  source: DtSwitch<T>;
  checked: boolean;
}

// Boilerplate for applying mixins to DtSwitch.
export class DtSwitchBase {}
export const _DtSwitchMixinBase = mixinTabIndex(mixinDisabled(DtSwitchBase));

@Component({
  moduleId: module.id,
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
  providers: [DT_SWITCH_CONTROL_VALUE_ACCESSOR],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtSwitch<T> extends _DtSwitchMixinBase
  implements
    CanDisable,
    HasTabIndex,
    OnDestroy,
    AfterViewInit,
    ControlValueAccessor {
  /** Whether or not the switch is checked. */
  @Input()
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    const coercedValue = coerceBooleanProperty(value);
    if (coercedValue !== this._checked) {
      this._checked = coercedValue;
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

  /** Whether the switch is required. */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }

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

  /** Name value will be applied to the input element if present */
  @Input() name: string | null = null;

  /** The value attribute of the native input element */
  @Input() value: T;

  /** The 'aria-labelledby' attribute takes precedence as the element's text alternative. */
  // tslint:disable-next-line:no-input-rename
  @Input('aria-label') ariaLabel = '';

  /** The 'aria-describedby' attribute is read after the element's label and field type. */
  // tslint:disable-next-line:no-input-rename
  @Input('aria-labelledby') ariaLabelledby: string | null = null;

  /** Event emitted when the switch's `checked` value changes. */
  // Disabling no-output-native rule because we want to keep a similar API to the checkbox
  // tslint:disable-next-line: no-output-native
  @Output() readonly change = new EventEmitter<DtSwitchChange<T>>();

  /** The native switch input element */
  @ViewChild('input', { static: true }) _inputElement: ElementRef;

  /** Returns the unique id for the visual hidden input. */
  get inputId(): string {
    return `${this.id}-input`;
  }

  _onTouched: () => void = () => {};

  private _checked = false;
  private _uid = `dt-switch-${nextUniqueId++}`;
  private _id: string;
  private _required: boolean;
  private _disabled = false;
  private _controlValueAccessorChangeFn: (value: boolean) => void = () => {};

  constructor(
    private _renderer: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
    @Attribute('tabindex') tabIndex: string
  ) {
    super();

    // Force setter to be called in case id was not specified.
    this.id = this.id;
    this.tabIndex = parseInt(tabIndex, 10) || 0;
  }

  ngAfterViewInit(): void {
    this._focusMonitor
      .monitor(this._inputElement.nativeElement, false)
      .subscribe(focusOrigin => {
        this._onInputFocusChange(focusOrigin);
      });
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._inputElement.nativeElement);
  }

  toggle(): void {
    this.checked = !this.checked;
  }

  _onInputClick(event: Event): void {
    // We have to stop propagation for click events on the visual hidden input element.
    // Otherwise this will lead to multiple click events.
    event.stopPropagation();
  }

  _onInputChange(event: Event): void {
    // We always have to stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();

    this.checked = this._inputElement.nativeElement.checked;

    // Emit our custom change event only if the underlying input emitted one. This ensures that
    // there is no change event, when the checked state changes programmatically.
    this._emitChangeEvent();
  }

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

  private _onInputFocusChange(focusOrigin: FocusOrigin): void {
    const element = this._elementRef.nativeElement;

    if (focusOrigin === 'keyboard') {
      this._renderer.addClass(element, 'dt-switch-focused');
    } else if (!focusOrigin) {
      this._renderer.removeClass(element, 'dt-switch-focused');
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
  // tslint:disable-next-line: no-use-before-declare no-forward-ref
  useExisting: forwardRef(() => DtSwitchRequiredValidator),
  multi: true,
};

/**
 * Validator for checkbox's required attribute in template-driven checkbox.
 * TODO @alexfrasst: Remove once CheckboxRequiredValidator supports custom checkbox
 */
@Directive({
  selector: `dt-switch[required][formControlName],
             dt-switch[required][formControl], dt-switch[required][ngModel]`,
  providers: [DT_SWITCH_REQUIRED_VALIDATOR],
  host: { '[attr.required]': 'required ? "" : null' },
})
export class DtSwitchRequiredValidator extends CheckboxRequiredValidator {}
