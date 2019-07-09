import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <div dtTheme=":dark" class="dark">
      <dt-checkbox checked>Check me</dt-checkbox>
      <dt-checkbox [indeterminate]="true">Indeterminate</dt-checkbox>
      <dt-checkbox disabled checked>Disabled</dt-checkbox>
    </div>
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
export class CheckboxDarkExample {}
