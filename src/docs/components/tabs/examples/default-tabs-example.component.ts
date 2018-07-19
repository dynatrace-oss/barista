import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
  <dt-tab-group>
    <dt-tab disabled>
      <ng-template dtTabLabel>Traffic</ng-template>
      <ng-template dtTabContent>
        <h1>Traffic</h1>
      </ng-template>
    </dt-tab>
    <dt-tab>
      <ng-template dtTabLabel>Packets</ng-template>
      <ng-template dtTabContent>
        <h1>Packets</h1>
      </ng-template>
    </dt-tab>
    <dt-tab color="error">
      <ng-template dtTabLabel>Quality</ng-template>
      <ng-template dtTabContent>
        <h1>Quality</h1>
      </ng-template>
    </dt-tab>
    <dt-tab color="recovered">
      <ng-template dtTabLabel>Connectivity</ng-template>
      <ng-template dtTabContent>
        <h1>Connectivity</h1>
      </ng-template>
    </dt-tab>
  </dt-tab-group>
  `,
})
@OriginalClassName('DefaultTabsExampleComponent')
export class DefaultTabsExampleComponent { }
