import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <input
      dtInput
      required
      placeholder="Enter Text"
      aria-label="Enter text"
      [(ngModel)]="textValue"
      #textControl="ngModel"
    />
    <p
      >Output: <em>{{ textValue || 'none' }}</em></p
    >
    <!-- The lines below are just for the showcase, do not use this in production -->
    <p>
      Touched: {{ textControl.touched }}<br />
      Dirty: {{ textControl.dirty }}<br />
      Status: {{ textControl.control?.status }}<br />
    </p>
  `,
})
export class InputNgModelExample {
  textValue = '';
}
