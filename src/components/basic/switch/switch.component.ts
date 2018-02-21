import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { CheckboxComponent } from "../checkbox/checkbox.component";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "dt-switch",
  styleUrls: ["./switch.component.scss"],
  template: `
      <input type="checkbox"
        [attr.id]="id"
        [attr.checked]="value ? 'checked' : null"
        [attr.value]="value"
        [attr.disabled]="disabled ? 'disabled' : null"
        class="switch"
        [class.to-right]="right"
        (change)="onChanged()" />
      <label
        class="switch__label"
        [attr.for]="id">
        <span class="switch__caption" [innerHtml]="label"></span>
      </label>
  `,
})

export class SwitchComponent extends CheckboxComponent {

  private _right = false;

  public get right(): boolean | string {
    return this._right;
  }

  @Input("right")
  public set right(right: boolean | string) {
    this._right = coerceBooleanProperty(right);
  }
}
