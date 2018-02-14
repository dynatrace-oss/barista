import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `
<dt-checkbox (notify)="onStateChanged1($event)"></dt-checkbox>
<div>Checkbox state: {{ state1 }}</div>

<dt-checkbox (notify)="onStateChanged2($event)"></dt-checkbox>
<div>Checkbox state: {{ state2 }}</div>

<dt-checkbox (notify)="onStateChanged3($event)" disabled></dt-checkbox>
<div>Checkbox state: {{ state3 }}</div>
`,
  // @formatter:on
})
export class CheckboxClickExampleComponent {
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
