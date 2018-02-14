import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `
<dt-switch (notify)="onStateChanged1($event)"></dt-switch>
<div>Switch state: {{ state1 }}</div>

<dt-switch (notify)="onStateChanged2($event)"></dt-switch>
<div>Switch state: {{ state2 }}</div>

<dt-switch (notify)="onStateChanged3($event)" disabled></dt-switch>
<div>Switch state: {{ state3 }}</div>
`,
  // @formatter:on
})
export class SwitchClickExampleComponent {
  public state1: boolean = false;
  public state2: boolean = false;
  public state3: boolean = false;

  onStateChanged1(value: boolean) {
    this.state1 = value;
  }

  onStateChanged2(value: boolean) {
    this.state2 = value;
  }

  onStateChanged3(value: boolean) {
    this.state3 = value;
  }
}
