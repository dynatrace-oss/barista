import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `<dt-checkbox>not checked</dt-checkbox>
<dt-checkbox disabled>...disabled</dt-checkbox>
<dt-checkbox checked>checked</dt-checkbox>
<dt-checkbox checked disabled>...disabled</dt-checkbox>`,
  // @formatter:on
})
export class CheckboxSimpleExampleComponent {
}
