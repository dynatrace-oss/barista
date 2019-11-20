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

import { DtEventChartSelectedEvent } from '@dynatrace/barista-components/event-chart';

@Component({
  selector: 'event-chart-demo',
  template: `
    <dt-event-chart>
      <dt-event-chart-event
        (selected)="triggerSelection($event)"
        value="0"
        lane="xhr"
      ></dt-event-chart-event>
      <dt-event-chart-event
        (selected)="triggerSelection($event)"
        value="15"
        lane="xhr"
      ></dt-event-chart-event>
      <dt-event-chart-event
        (selected)="triggerSelection($event)"
        value="25"
        lane="xhr"
      ></dt-event-chart-event>
      <dt-event-chart-event
        (selected)="triggerSelection($event)"
        value="10"
        lane="user-event"
      ></dt-event-chart-event>
      <dt-event-chart-event
        (selected)="triggerSelection($event)"
        value="35"
        lane="xhr"
        duration="15"
      ></dt-event-chart-event>
      <dt-event-chart-event
        (selected)="triggerSelection($event)"
        value="75"
        lane="user-event"
      ></dt-event-chart-event>

      <dt-event-chart-lane name="xhr" label="XHR"></dt-event-chart-lane>
      <dt-event-chart-lane
        name="user-event"
        label="User event"
      ></dt-event-chart-lane>
    </dt-event-chart>

    <div>See selection output in the browsers console.</div>
  `,
})
export class EventChartSelectionExample {
  _lastSelected: DtEventChartSelectedEvent<string>;
  triggerSelection(event: DtEventChartSelectedEvent<string>): void {
    // tslint:disable-next-line: no-console
    console.log(event);
  }
}
