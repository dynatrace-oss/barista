import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
  <dt-form-field>
    <dt-label>Value to be transformed</dt-label>
    <input dtInput #value [(ngModel)]="exampleValue"/>
  </dt-form-field>
  <p>per request: {{ exampleValue | dtRate:'request' }}</p>
  <p>per second: {{ exampleValue | dtCount | dtRate:'s' }}</p>
  <p>chaining bytes + rate: {{ exampleValue | dtBytes | dtRate:'s' }}</p>
  <p>chaining count + rate: {{ exampleValue | dtCount | dtRate:'s' }}</p>
  `,
})
@OriginalClassName('RatePipeExample')
export class RateExample {
  exampleValue: number;
}
