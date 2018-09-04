import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
  <dt-form-field>
    <dt-label>Value to be transformed</dt-label>
    <input dtInput #value [(ngModel)]="exampleValue"/>
  </dt-form-field>
  <p>Default: {{ exampleValue | dtBytes }}</p>
  <p>Factor 1024: {{ exampleValue | dtBytes: 1024 }}</p>
  <p>kB: {{ exampleValue | dtKilobytes }}</p>
  <p>MB: {{ exampleValue | dtMegabytes }}</p>
  `,
})
@OriginalClassName('BytesPipeExample')
export class BytesExample {
  exampleValue: number;
}
