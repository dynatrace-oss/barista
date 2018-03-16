import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { ChangeDetectionStrategy, Component, HostBinding, Input } from "@angular/core";
import { CanBeDisabled, mixinDisabled } from "@dynatrace/angular-components/core";
import { MixinComposer } from "@dynatrace/angular-components/core";

enum ButtonImportance {
  PRIMARY,
  SECONDARY,
}

enum ButtonVariant {
  NORMAL = "normal",
  WARNING = "warning",
  CALL_TO_ACTION = "call-to-action",
}

export const _ButtonComponentBase = MixinComposer.fromScratch()
    .with(mixinDisabled)
    .build();

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  // tslint:disable-next-line:component-selector
  selector: "[dt-btn]",
  styleUrls: ["./button.component.scss"],
  template: `
    <ng-content></ng-content>
  `,
})
export class ButtonComponent extends _ButtonComponentBase implements CanBeDisabled {

  private importance = ButtonImportance.PRIMARY;
  private _variant = ButtonVariant.NORMAL;

  @Input()
  @HostBinding("class.secondary")
  public set secondary(value: boolean) {
    this.importance = coerceBooleanProperty(value) ? ButtonImportance.SECONDARY : ButtonImportance.PRIMARY;
  }

  public get secondary(): boolean {
      return this.importance === ButtonImportance.SECONDARY;
  }

  @HostBinding("class.primary")
  public get primary(): boolean {
      return this.importance === ButtonImportance.PRIMARY;
  }

  @Input()
  public set variant(value: string) {
    this._variant = value ? ButtonVariant[value] : ButtonVariant.NORMAL;
  }

  @HostBinding("class.call-to-action")
  private get variantCallToAction(): boolean {
    return this._variant === ButtonVariant.CALL_TO_ACTION;
  }

  @HostBinding("class.warning")
  private get variantWarning(): boolean {
      return this._variant === ButtonVariant.WARNING;
  }

  @HostBinding("attr.disabled")
  private get disabledBinding(): true | undefined {
    return this.disabled ? this.disabled : undefined;
  }
}
