import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
  <dt-form-field>
    <dt-label>Value to be transformed</dt-label>
    <input dtInput #value [(ngModel)]="exampleValue"/>
  </dt-form-field>
  <p>Default: {{ exampleValue | dtPercent }}</p>`,
})
export class FormattersPercentExample {
  exampleValue: number;
}
