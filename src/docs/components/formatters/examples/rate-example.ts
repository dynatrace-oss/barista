import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';
import { DtRateUnit } from '@dynatrace/angular-components';

@Component({
  moduleId: module.id,
  template: `
  <dt-form-field>
    <dt-label>Value to be transformed</dt-label>
    <input dtInput #value [(ngModel)]="exampleValue"/>
  </dt-form-field>
  <p>per request: {{ exampleValue | dtRate:'request' }}</p>
  <p>per second: {{ exampleValue | dtCount | dtRate:'s' }}</p>
  <p>Chaining rate + bytes: {{ exampleValue | dtRate:'s' | dtBytes }}</p>
  <p>Chaining bytes + rate: {{ exampleValue | dtBytes | dtRate:'s' }}</p>
  `,
})
@OriginalClassName('RateExample')
export class RateExample {
  exampleValue: number;
  rate = DtRateUnit.PER_MILLISECOND;
}
