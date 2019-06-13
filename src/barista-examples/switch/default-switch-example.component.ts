import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-switch>Default</dt-switch>
    <dt-switch checked>Checked</dt-switch>
    <dt-switch disabled>Disabled</dt-switch>
    <dt-switch checked disabled>Checked Disabled</dt-switch>
  `,
})
export class DefaultSwitchExampleComponent { }
