import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `<dt-switch (checkedChange)="onStateChanged1($event)"></dt-switch>
<div>Switch state: {{ state1 }}</div>

<dt-switch (checkedChange)="onStateChanged2($event)"></dt-switch>
<div>Switch state: {{ state2 }}</div>

<dt-switch (checkedChange)="onStateChanged3($event)" disabled></dt-switch>
<div>Switch state: {{ state3 }}</div>`,
  // @formatter:on
})
export class SwitchClickExampleComponent {
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
