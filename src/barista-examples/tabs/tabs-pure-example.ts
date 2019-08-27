import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <dt-tab-group>
      <dt-tab>
        <ng-template dtTabLabel>Traffic</ng-template>
        <ng-template dtTabContent>
          <h3>Traffic</h3>
        </ng-template>
      </dt-tab>
      <dt-tab>
        <ng-template dtTabLabel>Packets</ng-template>
        <ng-template dtTabContent>
          <h3>Packets</h3>
        </ng-template>
      </dt-tab>
      <dt-tab>
        <ng-template dtTabLabel>Quality</ng-template>
        <ng-template dtTabContent>
          <h3>Quality</h3>
        </ng-template>
      </dt-tab>
    </dt-tab-group>
  `,
})
export class TabsPureExample {}
