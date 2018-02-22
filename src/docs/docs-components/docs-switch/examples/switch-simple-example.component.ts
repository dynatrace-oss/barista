import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `<dt-switch checked>ON</dt-switch>
<dt-switch>OFF</dt-switch>
<dt-switch checked disabled>ON, disabled</dt-switch>
<dt-switch disabled>OFF, disabled</dt-switch>`,
  // @formatter:on
})
export class SwitchSimpleExampleComponent {
}
