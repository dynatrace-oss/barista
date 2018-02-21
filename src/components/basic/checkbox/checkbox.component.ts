import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

let nextUniqueId = 0;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
    },
  ],
  selector: "dt-checkbox",
  styleUrls: ["./checkbox.component.scss"],
  template: `
      <input type="checkbox"
        [attr.id]="id"
        [attr.checked]="value ? 'checked' : null"
        [attr.value]="value"
        [attr.disabled]="disabled ? 'disabled' : null"
        class="checkbox"
        (change)="onChanged();"/>
      <label
        class="checkbox__label"
        [attr.for]="id">
        <span role="checkbox" class="checkbox__caption" [innerHtml]="label"></span>
      </label>
  `,
})

export class CheckboxComponent implements ControlValueAccessor {

  @Output() public checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Unique id for this input. */
  private readonly _uid = `dt-checkbox-${nextUniqueId++}`;

  /** _uid or provided id via input */
  private _id: string;
  private _value = false;
  private _disabled;
  private _label = "";

  public constructor() {
    this.id = this.id;
  }

  // tslint:disable: no-empty no-any
  public onChange: any = () => { };
  public onTouched: any = () => { };
  // tslint:enable: no-empty no-any

  public get value(): boolean {
    return this._value;
  }

  @Input("checked") public set value(v: boolean) {
    this._value = coerceBooleanProperty(v);
    this.onChange(v);
    this.onTouched();
  }

  public get disabled(): boolean | string {
    return this._disabled;
  }

  @Input("disabled")
  public set disabled(disabled: boolean | string) {
    this._disabled = coerceBooleanProperty(disabled);
  }

  public get label(): string {
    return this._label;
  }

  @Input("label")
  public set label(label: string) {
    this._label = label;
  }

  /** Unique id of the element. */
  @Input()
  public get id(): string { return this._id; }
  public set id(customId: string) {
    this._id = customId || this._uid;
  }

  public onChanged(): void {
    this.value = !this.value;
    this.checkedChange.emit(this.value);
  }

  // From ControlValueAccessor interface
  public writeValue(v: boolean | string): void {
    if (coerceBooleanProperty(v)) {
      this._value = coerceBooleanProperty(v);
    }
  }

  // From ControlValueAccessor interface
  public registerOnChange(fn: void): void {
    this.onChange = fn;
  }

  // From ControlValueAccessor interface
  public registerOnTouched(fn: void): void {
    this.onTouched = fn;
  }

  // From ControlValueAccessor interface
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
