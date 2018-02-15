import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

let nextUniqueId = 0;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "dt-checkbox",
  styleUrls: ["./checkbox.component.scss"],
  template: `
      <input type="checkbox"
        [attr.checked]="value ? 'checked' : null"
        [attr.value]="value"
        [attr.disabled]="disabled ? 'disabled' : null"
        (change)="onChange()"
        class="checkbox"
        [attr.id]="id" />
      <label
        class="checkbox__label"
        [attr.for]="id">
        <span role="checkbox" class="checkbox__caption" [innerHtml]="label"></span>
      </label>
  `,
})
export class CheckboxComponent {

  @Output() public notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Unique id for this input. */
  private readonly _uid = `dt-checkbox-${nextUniqueId++}`;

  /** _uid or provided id via input */
  private _id: string;
  private _value = false;
  private _disabled;
  private _label = "";

  public get value(): boolean {
    return this._value;
  }

  @Input("checked") public set value(v: boolean) {
    this._value = coerceBooleanProperty(v);
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

  public constructor() {
    this.id = this.id;
  }

  public onChange(): void {
    this.value = !this.value;
    this.notify.emit(this.value);
  }
}
