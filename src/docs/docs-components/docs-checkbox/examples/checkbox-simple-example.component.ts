import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `
<dt-checkbox label="not checked"></dt-checkbox>
<dt-checkbox disabled label="...disabled"></dt-checkbox>
<dt-checkbox checked label="checked"></dt-checkbox>
<dt-checkbox checked disabled label="...disabled"></dt-checkbox>
`,
  // @formatter:on
})
export class CheckboxSimpleExampleComponent {
}
