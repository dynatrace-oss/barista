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
  selector: 'event-chart-demo',
  template: `
    <dt-event-chart>
      <dt-event-chart-event
        value="0"
        lane="xhr"
        data="1"
      ></dt-event-chart-event>
      <dt-event-chart-event
        value="15"
        lane="xhr"
        color="error"
        data="2"
      ></dt-event-chart-event>
      <dt-event-chart-event
        value="25"
        lane="xhr"
        data="3"
      ></dt-event-chart-event>
      <dt-event-chart-event
        value="10"
        lane="user-event"
        data="5"
      ></dt-event-chart-event>
      <dt-event-chart-event
        value="35"
        lane="xhr"
        duration="15"
        data="6"
      ></dt-event-chart-event>
      <dt-event-chart-event
        value="75"
        lane="user-event"
        data="7"
      ></dt-event-chart-event>

      <dt-event-chart-lane name="xhr" label="XHR"></dt-event-chart-lane>
      <dt-event-chart-lane
        name="user-event"
        label="User event"
      ></dt-event-chart-lane>

      <ng-template dtEventChartOverlay let-tooltip>
        <div *ngFor="let t of tooltip">Data for element: {{ t.data }}</div>
      </ng-template>
    </dt-event-chart>
  `,
})
export class EventChartOverlayExample {}
