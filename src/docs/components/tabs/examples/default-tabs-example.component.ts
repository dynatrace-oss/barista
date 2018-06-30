import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
  <dt-tab-group>
    <dt-tab [value]="cpu-usage" selected>
      <dt-tab-label>CPU Usage</dt-tab-label>
      <ng-template>some content</ng-template>
    </dt-tab>
    <dt-tab [value]="physical-cpu" disabled>
                  <dt-tab-label>Physical CPU</dt-tab-label>
      some content disabled
    </dt-tab>
    <dt-tab [value]="cpu-ready-time" color="error">
      <dt-tab-label>CPU ready time</dt-tab-label>
      some content
    </dt-tab>
  </dt-tab-group>
  `,
})
@OriginalClassName('DefaultTabsExampleComponent')
export class DefaultTabsExampleComponent { }
