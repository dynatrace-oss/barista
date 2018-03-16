import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { ChangeDetectionStrategy, Component, forwardRef, Input } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { CheckboxComponent } from "@dynatrace/angular-components/basic/checkbox";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      // tslint:disable-next-line:no-forward-ref
      useExisting: forwardRef(() => SwitchComponent),
    },
  ],
  selector: "dt-switch",
  styleUrls: ["./switch.component.scss"],
  template: `
      <input type="checkbox"
        [attr.id]="id"
        [attr.checked]="value ? 'checked' : null"
        [attr.value]="value"
        [disabled]="disabled ? 'disabled' : null"
        class="switch"
        [class.to-right]="right"
        (change)="onChanged()" />
      <label
        class="switch__label"
        [attr.for]="id">
        <span class="switch__caption" ><ng-content></ng-content></span>
      </label>
  `,
})

export class SwitchComponent extends CheckboxComponent {

  private _right = false;

  public get right(): boolean {
    return this._right;
  }

  @Input("right")
  public set right(right: boolean) {
    this._right = coerceBooleanProperty(right);
  }
}
