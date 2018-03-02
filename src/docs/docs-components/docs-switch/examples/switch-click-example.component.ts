import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `<dt-switch (checkedChange)="state1 = $event">Switch state: {{ state1 }}</dt-switch><br>
<dt-switch (checkedChange)="state2 = $event">Switch state: {{ state2 }}</dt-switch><br>
<dt-switch (checkedChange)="state3 = $event" disabled>Switch state: {{ state3 }}</dt-switch>`,
  // @formatter:on
})
export class SwitchClickExampleComponent {
  public state1 = false;
  public state2 = false;
  public state3 = false;
}
