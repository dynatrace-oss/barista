import { Component } from '@angular/core';

@Component({
  selector: 'component-barista-example',
  template: `
    <dt-form-field>
      <dt-label>Value to be transformed</dt-label>
      <input dtInput [(ngModel)]="exampleValue" />
    </dt-form-field>
    <p>Ms: {{ exampleValue | dtTime }}</p>
    <p>Hour: {{ exampleValue | dtTime: 'h' }}</p>
    <p>Day to Second: {{ exampleValue | dtTime: 'd':'s' }}</p>
  `,
})
export class FormattersTimeExample {
  exampleValue: number;
}
