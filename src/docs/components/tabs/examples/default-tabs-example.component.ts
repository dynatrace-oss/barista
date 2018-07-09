import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
  <dt-tab-group>
    <dt-tab value="physical-cpu" disabled>
      <ng-template dtTabLabel>Physical <em>CPU</em></ng-template>
      some content disabled
    </dt-tab>
    <dt-tab value="cpu-ready-time">
      <ng-template dtTabLabel>CPU ready time</ng-template>
      <h1>some content</h1>
    </dt-tab>
    <dt-tab value="cpu-ready-time" color="error">
      <ng-template dtTabLabel>CPU ready time</ng-template>
      <h1>some content</h1>
    </dt-tab>
    <dt-tab value="cpu-ready-time" color="recovered">
      <ng-template dtTabLabel>CPU ready time</ng-template>
      <h1>some content</h1>
    </dt-tab>
  </dt-tab-group>
  `,
})
@OriginalClassName('DefaultTabsExampleComponent')
export class DefaultTabsExampleComponent { }
