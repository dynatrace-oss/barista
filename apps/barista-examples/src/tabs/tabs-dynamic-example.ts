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
      <dt-tab>
        <ng-template dtTabLabel>Physical CPU</ng-template>
        <ng-template dtTabContent>
          <h3>Physical CPUs content</h3>
        </ng-template>
      </dt-tab>
      <dt-tab>
        <ng-template dtTabLabel>CPU ready time</ng-template>
        <ng-template dtTabContent>
          <h3>cpu-ready-time content</h3>
        </ng-template>
      </dt-tab>
      <dt-tab *ngIf="hasProblems" color="error">
        <ng-template dtTabLabel>11 problems</ng-template>
        <ng-template dtTabContent>
          <h3>Housten we have 11 problems!</h3>
        </ng-template>
      </dt-tab>
    </dt-tab-group>
    <button dt-button (click)="hasProblems = !hasProblems">
      Toggle problems
    </button>
  `,
})
export class TabsDynamicExample {
  hasProblems = false;
}
