import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { ChangeDetectionStrategy, Component, ContentChildren, ElementRef, HostBinding, Input, QueryList } from "@angular/core";
import { CanDisable, mixinDisabled } from "../../core/mixins/disabled.mixin";
import { EmptyClass } from "../../core/mixins/empty-class";

const _ButtonComponentBase = mixinDisabled(EmptyClass);

enum ButtonImportance {
  PRIMARY,
  SECONDARY,
}

enum ButtonVariant {
  NORMAL = "normal",
  WARNING = "warning",
  CALL_TO_ACTION = "call-to-action",
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.disabled]": "disabled || null",
  },
  inputs: ["disabled", "secondary"],
  preserveWhitespaces: false,
  selector: "[dt-btn]",
  styleUrls: ["./button.component.scss"],
  template: `
    <ng-content></ng-content>
  `,
})
export class ButtonComponent extends _ButtonComponentBase implements CanDisable {
  @ContentChildren(ElementRef)
  public content: QueryList<ElementRef>;

  private importance = ButtonImportance.PRIMARY;
  private _variant = ButtonVariant.NORMAL;

  public set secondary(value: boolean) {
    this.importance = coerceBooleanProperty(value) ? ButtonImportance.SECONDARY : ButtonImportance.PRIMARY;
  }

  @HostBinding("class.secondary")
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
  public get variantCallToAction(): boolean {
    return this._variant === ButtonVariant.CALL_TO_ACTION;
  }

  @HostBinding("class.warning")
  public get variantWarning(): boolean {
      return this._variant === ButtonVariant.WARNING;
  }
}
