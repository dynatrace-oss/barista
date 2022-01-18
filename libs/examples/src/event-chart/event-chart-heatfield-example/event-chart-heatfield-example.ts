/**
 * @license
 * Copyright 2022 Dynatrace LLC
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
  selector: 'dt-example-event-chart-heatfield',
  templateUrl: 'event-chart-heatfield-example.html',
})
export class DtExampleEventChartHeatfield {
  selected: DtEventChartSelectedEvent<number>;

  _userEventsLaneEnabled = true;

  _errorLegendEnabled = false;

  _durationLabel = 'This is the default duration legend';

  _events = [
    {
      value: 0,
      duration: 0,
      lane: 'xhr',
      color: 'default',
      data: 1,
    },
    {
      value: 15,
      duration: 0,
      lane: 'xhr',
      color: 'default',
      data: 2,
    },
    {
      value: 35,
      duration: 0,
      lane: 'xhr',
      color: 'default',
      data: 3,
    },
    {
      value: 45,
      duration: 0,
      lane: 'user-event',
      color: 'error',
      data: 4,
    },
    {
      value: 65,
      duration: 0,
      lane: 'user-event',
      color: 'conversion',
      data: 5,
    },
    {
      value: 80,
      duration: 20,
      lane: 'xhr',
      color: 'default',
      data: 6,
    },
    {
      value: 110,
      duration: 0,
      lane: 'xhr',
      color: 'default',
      data: 7,
    },
  ];

  _heatfields = [
    {
      start: 0,
      end: 35,
      color: 'default',
      data: {
        name: 'Field 1',
      },
    },
    {
      start: 45,
      end: 65,
      color: 'error',
      data: {
        name: 'Field 2',
      },
    },
    {
      start: 65,
      color: 'default',
      data: {
        name: 'Field 3',
      },
    },
  ];

  logSelected(selected: DtEventChartSelectedEvent<number>): void {
    this.selected = selected;
  }
}
