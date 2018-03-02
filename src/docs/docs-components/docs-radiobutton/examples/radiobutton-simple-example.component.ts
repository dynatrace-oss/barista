import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `<dt-radio name="active"checked>yes</dt-radio>
      <dt-radio name="active">no</dt-radio>
      <dt-radio name="inactive" checked disabled>yes</dt-radio>
      <dt-radio name="inactive"disabled>no</dt-radio>`,
  // @formatter:on
})
export class RadiobuttonSimpleExampleComponent {
}
