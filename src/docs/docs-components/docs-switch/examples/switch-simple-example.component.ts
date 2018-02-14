import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `
<dt-switch checked label="ON"></dt-switch>

<dt-switch label="OFF"></dt-switch>

<dt-switch checked disabled label="ON, disabled"></dt-switch>

<dt-switch disabled label="OFF, disabled"></dt-switch>
`,
  // @formatter:on
})
export class SwitchSimpleExampleComponent {
}
