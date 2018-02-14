import { coerceBooleanProperty } from "@angular/cdk/coercion";
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import { FormsModule } from "@angular/forms";
import {CheckboxComponent} from "../checkbox/checkbox.component";

let nextUniqueId = 0;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "dt-switch",
  styleUrls: ["./switch.component.scss"],
  template: `
      <input type="checkbox"
        [attr.checked]="checked ? 'checked' : null"
        [attr.disabled]="disabled ? 'disabled' : null"
        class="switch"
        [class.to-right]="right"
        [attr.id]="id" />
      <label 
        class="switch__label"
        (click)="onClick()"
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
