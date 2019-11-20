/**
 * @license
 * Copyright 2019 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'component-barista-example',
  template: `
    <dt-tab-group>
      <dt-tab disabled>
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
      <dt-tab color="error">
        <ng-template dtTabLabel>Quality</ng-template>
        <ng-template dtTabContent>
          <h3>Quality</h3>
        </ng-template>
      </dt-tab>
      <dt-tab color="recovered">
        <ng-template dtTabLabel>Connectivity</ng-template>
        <ng-template dtTabContent>
          <h3>Connectivity</h3>
        </ng-template>
      </dt-tab>
    </dt-tab-group>
  `,
})
export class TabsDefaultExample {}
