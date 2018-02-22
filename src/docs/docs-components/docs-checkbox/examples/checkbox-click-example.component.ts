import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `<dt-checkbox (checkedChange)="state1 = $event">Checkbox state: {{ state1 }}</dt-checkbox><br>
<dt-checkbox (checkedChange)="state2 = $event">Checkbox state: {{ state2 }}</dt-checkbox><br>
<dt-checkbox (checkedChange)="state3 = $event" disabled>Checkbox state: {{ state3 }}</dt-checkbox>`,
  // @formatter:on
})
export class CheckboxClickExampleComponent {
  public state1 = false;
  public state2 = false;
  public state3 = false;
}
