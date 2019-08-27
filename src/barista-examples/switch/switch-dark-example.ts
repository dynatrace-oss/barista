import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <div class="dark" dtTheme=":dark">
      <dt-switch>Default</dt-switch>
      <dt-switch checked>Checked</dt-switch>
      <dt-switch disabled>Disabled</dt-switch>
      <dt-switch checked disabled>Checked Disabled</dt-switch>
    </div>
  `,
  styles: [
    `
      dt-switch {
        display: block;
      }
      dt-switch + dt-switch {
        margin-top: 20px;
      }
    `,
  ],
})
export class SwitchDarkExample {}
