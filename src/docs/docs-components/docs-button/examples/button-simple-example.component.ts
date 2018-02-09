import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `<a class="btn--primary">Primary button</a>
<a class="btn--primary" disabled>Disabled button</a>
<a class="btn--secondary" disabled>Secondary button</a>
<a class="btn--primary icon-plus">Button with an icon</a>`,
  // @formatter:on
})
export class ButtonSimpleExampleComponent {
}
