import {Component} from '@angular/core';
import {OriginalClassName} from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
    <div class="demo-card">
      <dt-cta-card>
        <dt-cta-card-title i18n>You're missing out on log analytics!</dt-cta-card-title>
        <dt-cta-card-action>
          <a dt-button color="cta" i18n>Enable log analysis</a>
        </dt-cta-card-action>
        <dt-cta-card-title-action>
          <a dt-button variant="secondary" color="cta" style="padding: 0 3px 0 7px;"><dt-icon name="abort"></dt-icon></a>
        </dt-cta-card-title-action>
        <dt-cta-card-image><img src="/assets/cta-noagent.svg"></dt-cta-card-image>
        <span i18n>
      Enable Dynatrace log analytics to automatically correlate host-process log data with problems detected in your
          environment. Search log files and create pattern-detection rules that trigger custom events.
    </span>
      </dt-cta-card>
    </div>`,
})
@OriginalClassName('ClosableCtaCardExampleComponent')
export class ClosableCtaCardExampleComponent {
}
