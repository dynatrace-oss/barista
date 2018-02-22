import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { CanBeDisabled, mixinDisabled } from "../../core/mixins/disabled.mixin";
import { MixinComposer } from "../../core/mixins/MixinComposer";

let nextUniqueId = 0;

export const _CheckboxComponentsBase = MixinComposer.fromScratch()
    .with(mixinDisabled)
    .build();

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["disabled"],
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
        [disabled]="disabled ? 'disabled' : null"
        class="checkbox"
        (change)="onChanged();"/>
      <label
        class="checkbox__label"
        [attr.for]="id">
        <span class="checkbox__caption"><ng-content></ng-content></span>
      </label>
  `,
})

export class CheckboxComponent extends _CheckboxComponentsBase implements CanBeDisabled, ControlValueAccessor {

  @Output() public checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Unique id for this input. */
  private readonly _uid = `dt-checkbox-${nextUniqueId++}`;

  /** _uid or provided id via input */
  private _id: string;
  private _value = false;

  public constructor() {
    super();
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

  @Input()
  public get id(): string {
    return this._id;
  }

  // Not sure if custom ids should be allowed, perhaps not
  public set id(id: string) {
    this._id = id || this._uid;
  }

  public onChanged(): void {
    this.value = !this.value;
    this.checkedChange.emit(this.value);
  }

  // From ControlValueAccessor interface
  public writeValue(v: boolean): void {
    this._value = coerceBooleanProperty(v);
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
