import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
  <dt-form-field>
    <dt-label>Value to be transformed</dt-label>
    <input dtInput #value [(ngModel)]="exampleValue"/>
  </dt-form-field>
  <p>Default: {{ exampleValue | dtPercent }}</p>`,
})
@OriginalClassName('PercentExample')
export class PercentExample {
  exampleValue: number;
}
