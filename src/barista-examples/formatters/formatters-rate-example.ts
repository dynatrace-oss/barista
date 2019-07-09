import { Component } from '@angular/core';
import { DtRateUnit } from '@dynatrace/angular-components';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-form-field>
      <dt-label>Value to be transformed</dt-label>
      <input dtInput #value [(ngModel)]="exampleValue" />
    </dt-form-field>
    <p>per request: {{ exampleValue | dtRate: 'request' }}</p>
    <p>per second: {{ exampleValue | dtCount | dtRate: 's' }}</p>
    <p>Chaining rate + bytes: {{ exampleValue | dtRate: 's' | dtBytes }}</p>
    <p>Chaining bytes + rate: {{ exampleValue | dtBytes | dtRate: 's' }}</p>
  `,
})
export class FormattersRateExample {
  exampleValue: number;
  rate = DtRateUnit.PER_MILLISECOND;
}
