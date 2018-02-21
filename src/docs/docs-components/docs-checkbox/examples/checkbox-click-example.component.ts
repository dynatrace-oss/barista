import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `
<dt-checkbox (checkedChange)="onStateChanged1($event)"></dt-checkbox>
<div>Checkbox state: {{ state1 }}</div>

<dt-checkbox (checkedChange)="onStateChanged2($event)"></dt-checkbox>
<div>Checkbox state: {{ state2 }}</div>

<dt-checkbox (checkedChange)="onStateChanged3($event)" disabled></dt-checkbox>
<div>Checkbox state: {{ state3 }}</div>
`,
  // @formatter:on
})
export class CheckboxClickExampleComponent {
  public state1 = false;
  public state2 = false;
  public state3 = false;

  public onStateChanged1(value: boolean): void {
    this.state1 = value;
  }

  public onStateChanged2(value: boolean): void {
    this.state2 = value;
  }

  public onStateChanged3(value: boolean): void {
    this.state3 = value;
  }
}
