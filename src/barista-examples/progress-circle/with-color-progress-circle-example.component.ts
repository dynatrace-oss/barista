import { Component } from '@angular/core';

@Component({
  selector: 'barista-demo',
  template: `<dt-progress-circle [value]="45" [color]="color"></dt-progress-circle>
  <div>
  <dt-button-group [value]="color" (valueChange)="changed($event)">
    <dt-button-group-item value="main">main</dt-button-group-item>
    <dt-button-group-item value="accent">accent</dt-button-group-item>
    <dt-button-group-item value="warning">warning</dt-button-group-item>
    <dt-button-group-item value="error">error</dt-button-group-item>
    <dt-button-group-item value="recovered">recovered</dt-button-group-item>
  </dt-button-group>
  </div>`,
})
export class WithColorProgressCircleExampleComponent {
  color = 'error';

  changed(val: string): void {
    this.color = val;
  }
}
