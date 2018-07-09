import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
  <dt-tab-group>
    <dt-tab value="physical-cpu" disabled>
      <ng-template dt-tab-label>Physical CPU</ng-template>
      some content disabled
    </dt-tab>
    <dt-tab value="cpu-ready-time" color="error">
      <ng-template dt-tab-label>CPU ready time</ng-template>
      some content
    </dt-tab>
  </dt-tab-group>
  `,
})
@OriginalClassName('DefaultTabsExampleComponent')
export class DefaultTabsExampleComponent { }
