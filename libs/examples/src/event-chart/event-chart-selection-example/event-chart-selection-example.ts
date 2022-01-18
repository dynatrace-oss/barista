/**
 * @license
 * Copyright 2021 Dynatrace LLC
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
  selector: 'dt-example-event-chart-selection',
  templateUrl: 'event-chart-selection-example.html',
})
export class DtExampleEventChartSelection {
  _lastSelected: DtEventChartSelectedEvent<string>;
  triggerSelection(event: DtEventChartSelectedEvent<string>): void {
    // eslint-disable-next-line no-console
    console.log(event);
  }
}
