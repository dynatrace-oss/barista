import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
  <span>Example value:</span>
  <input dtInput #value [(ngModel)]="exampleValue"/>
  <br><br>
  <span>per request:</span>
  {{ exampleValue | dtRate:'request' }}
  <br><br>
  <span>per second:</span>
  {{ exampleValue | dtCount | dtRate:'s' }}
  <br><br>
  <span>units type check:</span>
  {{ exampleValue | dtPercent | dtRate:'request' }}
  <br><br>
  <span>per min / per s:</span>
  {{ exampleValue | dtCount:'count':'min' | dtRate:'s' }}
  <br><br>
  <span>per s / per min:</span>
  {{ exampleValue | dtCount:'count':'s' | dtRate:'min' }}
  <br><br>
  `,
  styles: [`
    span, input {
      width: 150px;
      display: inline-block;
    }
  `],
})
@OriginalClassName('RatePipeExample')
export class RateExample {
  exampleValue: number;
}
