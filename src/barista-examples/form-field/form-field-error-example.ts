import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <dt-form-field>
      <input
        type="text"
        required
        dtInput
        placeholder="Please insert text"
        [(ngModel)]="textValue"
        aria-label="Please insert text"
      />
      <dt-error>A wild error appears</dt-error>
    </dt-form-field>
  `,
})
export class FormFieldErrorExample {
  textValue: string;
}
