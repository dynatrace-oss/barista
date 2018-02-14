import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

let nextUniqueId = 0;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "dt-checkbox",
  styleUrls: ["./checkbox.component.scss"],
  template: `
      <input type="checkbox"
        [attr.checked]="checked ? 'checked' : null"
        [attr.disabled]="disabled ? 'disabled' : null"
        class="checkbox"
        [attr.id]="id" />
      <label
        class="checkbox__label"
        (click)="onClick()"
        [attr.for]="id">
        <span role="checkbox" class="checkbox__caption" [innerHtml]="label"></span>
      </label>
  `,
})
export class CheckboxComponent {

  /** Unique id for this input. */
  private readonly _uid = `dt-checkbox-${nextUniqueId++}`;

  /** _uid or provided id via input */
  private _id: string;

  private _checked;
  private _value;
  private _disabled;
  private _label = "";

  public onClick() {
    if (!this._disabled) {
      this.value = !this.value;
      this.notify.emit(this.value);
    }
  }

  public get value(): boolean {
    return this._value;
  }

  @Input("checked")
  public set value(value: boolean) {
    this._value = coerceBooleanProperty(value);
  }

  public get checked(): boolean | string {
    return this._checked;
  }

  @Input("checked")
  public set checked(checked: boolean | string) {
    this._checked = coerceBooleanProperty(checked);
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

  @Output() public notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  public constructor() {
    this.id = this.id;
  }
}
