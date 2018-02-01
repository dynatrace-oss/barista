import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { ChangeDetectionStrategy, Component, ContentChildren, ElementRef, HostBinding, Input, QueryList } from "@angular/core";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.disabled]": "disabled || null",
  },
  preserveWhitespaces: false,
  selector: ".btn, .btn--primary, .btn--secondary",
  styleUrls: ["./button.component.scss"],
  template: `
    <ng-content></ng-content>
  `,
})
export class ButtonComponent {
  @ContentChildren(ElementRef)
  public content: QueryList<ElementRef>;

  @HostBinding("class.btn")
  public readonly btnClass = true;

  private _disabled = false;

  public get disabled(): boolean | string {
    return this._disabled;
  }

  @Input("disabled")
  public set disabled(disabled: boolean | string) {
    this._disabled = coerceBooleanProperty(disabled);
  }

}
