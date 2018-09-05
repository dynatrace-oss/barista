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
  <!--<p>per request: {{ exampleValue | dtRate:'request' }}</p>
  <p>per second: {{ exampleValue | dtCount | dtRate:'s' }}</p>-->
  <p>Chaining rate + bytes: {{ exampleValue | dtRate:'s' | dtBytes }}</p>
  <p>Chaining bytes + rate: {{ exampleValue | dtBytes | dtRate:'s' }}</p>

  <p>Convert between 2 rates (input is 'ms' but display in per 's'): {{ exampleValue | dtRate:'s':'ms' }}</p>
  <dt-form-field>
    <dt-label>Chaning rate with a binding:</dt-label>
    <dt-select [(ngModel)]="rate">
      <dt-option value="ms">Per millisecond</dt-option>
      <dt-option value="s">Per second</dt-option>
      <dt-option value="min">Per minute</dt-option>
      <dt-option value="h">Per hour</dt-option>
      <dt-option value="d">Per day</dt-option>
      <dt-option value="w">Per week</dt-option>
      <dt-option value="mo">Per month</dt-option>
      <dt-option value="y">Per year</dt-option>
    </dt-select>
  </dt-form-field>
  <p>per {{rate}}: {{ exampleValue | dtCount | dtRate: rate }}</p>
  `,
})
@OriginalClassName('RatePipeExample')
export class RateExample {
  exampleValue: number;
  rate = DtRateUnit.PER_MILLISECOND;
}
