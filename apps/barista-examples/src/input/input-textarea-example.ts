import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <textarea
      dtInput
      placeholder="Please insert text"
      aria-label="Please insert text"
    ></textarea>
  `,
})
export class InputTextareaExample {}
