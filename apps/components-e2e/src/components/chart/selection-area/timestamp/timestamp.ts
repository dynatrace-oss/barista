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
import { DtE2EChartBase } from '../../chart-base';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'dt-e2e-timestamp',
  templateUrl: './timestamp.html',
  styles: [
    `
      :host {
        display: block;
        width: 1200px;
      }
    `,
  ],
})
export class DtE2ETimestamp extends DtE2EChartBase {
  closedCounter = 0;
  currentValue;

  constructor(dataService: DataService) {
    super(dataService);
  }

  closed(): void {
    this.closedCounter++;
  }

  valueChanges(_value: number): void {
    this.currentValue = _value;
  }
}
