import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <input
      type="text"
      dtInput
      placeholder="Please insert text"
      aria-label="Please insert text"
    />
  `,
})
export class InputDefaultExample {}
