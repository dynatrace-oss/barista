import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <div class="dt-switch-margin">
    <dt-switch>Default</dt-switch>
    </div>
    <div class="dt-switch-margin">
    <dt-switch checked>Checked</dt-switch>
    </div>
    <div class="dt-switch-margin">
    <dt-switch disabled>Disabled</dt-switch>
    </div>
    <div class="dt-switch-margin">
    <dt-switch checked disabled>Checked Disabled</dt-switch>
    </div>
  `,
})
export class DefaultSwitchExampleComponent { }
