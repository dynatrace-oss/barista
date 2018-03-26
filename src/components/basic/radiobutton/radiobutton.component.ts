import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { CanBeChecked, mixinChecked } from "../../core/mixins/checked.mixin";
import { CanBeDisabled, mixinDisabled } from "../../core/mixins/disabled.mixin";
import { MixinComposer } from "../../core/mixins/MixinComposer";

let nextUniqueId = 0;

export const _RadiobuttonComponentsBase = MixinComposer.fromScratch()
    .with(mixinDisabled)
    .with(mixinChecked)
    .build();

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "dt-radio",
  styleUrls: ["./radiobutton.component.scss"],
  template: `<input type="radio"
        [attr.id]="id"
        [attr.checked]="checked ? 'checked' : null"
        [attr.name]="name"
        [attr.value]="value"
        [disabled]="disabled ? 'disabled' : null"
        class="radio"
        (change)="onChanged();"/>
      <label
        class="radio__label"
        [attr.for]="id">
        <span class="radio__caption"><ng-content></ng-content></span>
      </label>`,
})

export class RadiobuttonComponent extends _RadiobuttonComponentsBase implements CanBeDisabled, CanBeChecked {

  @Output() public checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Unique id for this input. */
  private readonly _uid = `dt-radiobutton-${nextUniqueId++}`;

  /** _uid or provided id via input */
  private _id: string;
  private _name: string;
  private _value: string;

  public constructor() {
    super();
    this.id = this.id;
  }

  public get value(): string {
    return this._value;
  }

  @Input("value") public set value(v: string) {
    this._value = v;
  }

  public get name(): string {
    return this._name;
  }

  @Input("name") public set name(v: string) {
    this._name = v;
  }

  @Input()
  public get id(): string {
    return this._id;
  }

  public set id(id: string) {
    this._id = id || this._uid;
  }

  public onChanged(): void {
    // TODO
  }
}
