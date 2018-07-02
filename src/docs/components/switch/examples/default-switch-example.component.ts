import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

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
@OriginalClassName('DefaultSwitchExampleComponent')
export class DefaultSwitchExampleComponent { }
