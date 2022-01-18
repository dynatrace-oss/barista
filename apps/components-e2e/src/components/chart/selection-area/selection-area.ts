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
import { DtE2EChartBase } from '../chart-base';
import { DataService } from '../../../services/data.service';
import { DtChartRange } from '@dynatrace/barista-components/chart';

@Component({
  selector: 'dt-e2e-selection-area',
  templateUrl: './selection-area.html',
  styles: [
    `
      :host {
        display: block;
        width: 1200px;
      }
    `,
  ],
})
export class DtE2ESelectionArea extends DtE2EChartBase {
  @ViewChild(DtChartRange, { static: false }) dtChartRange: DtChartRange;

  constructor(dataService: DataService) {
    super(dataService);
  }

  closed(): void {
    // emits when the selection gets closed
  }

  valueChanges(_value: number | [number, number]): void {
    // emits when the value changes
  }

  // Set the time frame programmatically to a specific value
  setTimeframe(): void {
    this.dtChartRange.value = [1_564_546_551_309, 1_564_547_120_036];
  }
}
