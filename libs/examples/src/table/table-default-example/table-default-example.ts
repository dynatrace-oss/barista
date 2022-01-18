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

import { AfterViewInit, Component, ViewChild } from '@angular/core';

import {
  formatBytes,
  formatPercent,
  formatRate,
} from '@dynatrace/barista-components/formatters';
import { DtSort, DtTableDataSource } from '@dynatrace/barista-components/table';

@Component({
  selector: 'dt-example-table-default',
  templateUrl: './table-default-example.html',
})
export class DtExampleTableDefault implements AfterViewInit {
  data: object[] = [
    {
      host: 'et-demo-2-win4',
      cpu: 30,
      memoryPerc: 38,
      memoryTotal: 5830000000,
      traffic: 98700000,
    },
    {
      host: 'et-demo-2-win3',
      cpu: 26,
      memoryPerc: 46,
      memoryTotal: 6000000000,
      traffic: 62500000,
    },
    {
      host: 'docker-host2',
      cpu: 25.4,
      memoryPerc: 35,
      memoryTotal: 5810000000,
      traffic: 41900000,
    },
    {
      host: 'et-demo-2-win1',
      cpu: 23,
      memoryPerc: 7.86,
      memoryTotal: 5820000000,
      traffic: 98700000,
    },
  ];

  // Get the viewChild to pass the sorter reference to the datasource.
  @ViewChild('sortable', { read: DtSort, static: true }) sortable: DtSort;

  // Initialize the table's data source
  dataSource: DtTableDataSource<object>;
  constructor() {
    this.dataSource = new DtTableDataSource(this.data);
  }

  ngAfterViewInit(): void {
    // Set the dtSort reference on the dataSource, so it can react to sorting.
    this.dataSource.sort = this.sortable;
  }

  percentageFormatter = formatPercent;

  trafficFormatter = (value: number) =>
    formatBytes(formatRate(value, 's'), {
      inputUnit: 'byte',
      outputUnit: 'MB',
      factor: 1024,
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  combineMemory(row: any): string {
    const memoryPercentage = formatPercent(row.memoryPerc);
    const memoryTotal = formatBytes(row.memoryTotal, {
      inputUnit: 'byte',
      outputUnit: 'GB',
      factor: 1024,
    });
    return `${memoryPercentage} of ${memoryTotal}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  memorySortAccessor(row: any): number {
    return row.memoryPerc;
  }
}
