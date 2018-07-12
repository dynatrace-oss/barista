import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
  <dt-tab-group>
    <dt-tab disabled>
      <ng-template dtTabLabel>Physical <em>CPU</em></ng-template>
      <ng-template dtTabContent>
        <h1>pu-ready-time-recovered</h1>
        <button dt-button>initialize</button>
        <input type="text" value="some">
      </ng-template>
    </dt-tab>
    <dt-tab>
      <ng-template dtTabLabel>CPU ready time</ng-template>
      <ng-template dtTabContent>
        <h1>CPU-ready-time</h1>
        <button dt-button>initialize</button>
      </ng-template>
    </dt-tab>
    <dt-tab color="error">
      <ng-template dtTabLabel>CPU ready time</ng-template>
      <ng-template dtTabContent>
        <h1>cpu-ready-time-error</h1>
        <button dt-button>initialize</button>
      </ng-template>
    </dt-tab>
    <dt-tab color="recovered">
      <ng-template dtTabLabel>CPU ready time</ng-template>
      <ng-template dtTabContent>
        <h1>pu-ready-time-recovered</h1>
        <button dt-button>initialize</button>
        <input type="text" value="some">
      </ng-template>
    </dt-tab>
  </dt-tab-group>
  `,
})
@OriginalClassName('DefaultTabsExampleComponent')
export class DefaultTabsExampleComponent { }
