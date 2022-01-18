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

import { Component, ViewChild } from '@angular/core';

import {
  DtEventChartSelectedEvent,
  DtEventChart,
} from '@dynatrace/barista-components/event-chart';

@Component({
  selector: 'dt-example-event-chart-complex-selection',
  templateUrl: 'event-chart-complex-selection-example.html',
})
export class DtExampleEventChartComplexSelection<T> {
  _lastSelected: DtEventChartSelectedEvent<string>;

  i = 0;

  @ViewChild(DtEventChart, { static: true })
  private _eventChart: DtEventChart<T>;

  triggerSelection(event: DtEventChartSelectedEvent<string>): void {
    // eslint-disable-next-line no-console
    console.log(event);
  }

  // Analyze the selected event.
  analyze(): void {
    this._eventChart.closeOverlay();
  }

  // Select the next event
  selectNextEvent(): void {
    this._eventChart.select(this.i++);
  }

  // Deselect event
  deselectEvent(): void {
    this._eventChart.deselect();
  }
}
