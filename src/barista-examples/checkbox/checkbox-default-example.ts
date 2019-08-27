import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <dt-checkbox>Check me</dt-checkbox>
    <dt-checkbox checked>Checked checkbox</dt-checkbox>
    <dt-checkbox disabled>Disabled checkbox</dt-checkbox>
  `,
  styles: [
    `
      dt-checkbox {
        display: block;
      }
      dt-checkbox + dt-checkbox {
        margin-top: 20px;
      }
    `,
  ],
})
export class CheckboxDefaultExample {}
