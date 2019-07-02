import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
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
export class FormattersBytesExample {
  exampleValue: number;
}
