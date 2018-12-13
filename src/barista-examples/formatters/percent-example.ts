import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
  <dt-form-field>
    <dt-label>Value to be transformed</dt-label>
    <input dtInput #value [(ngModel)]="exampleValue"/>
  </dt-form-field>
  <p>Default: {{ exampleValue | dtPercent }}</p>`,
})
export class PercentExample {
  exampleValue: number;
}
