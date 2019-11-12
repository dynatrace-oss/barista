import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <dt-form-field>
      <dt-label>Some text</dt-label>
      <input type="text" dtInput placeholder="Please insert text" />
    </dt-form-field>
  `,
})
export class FormFieldDefaultExample {}
