import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-bar-indicator value="30" [align]="alignment"></dt-bar-indicator>
    <dt-button-group
      [value]="alignment"
      (valueChange)="changed($event)"
      style="margin-top: 16px"
    >
      <dt-button-group-item value="start">start</dt-button-group-item>
      <dt-button-group-item value="end">end</dt-button-group-item>
    </dt-button-group>
  `,
})
export class BarIndicatorAlignmentExample {
  alignment = 'end';

  changed(alignValue: string): void {
    this.alignment = alignValue;
  }
}
