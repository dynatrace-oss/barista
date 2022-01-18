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

import { DtSortEvent } from '@dynatrace/barista-components/table';

@Component({
  selector: 'dt-example-table-sorting',
  styleUrls: ['./table-sorting-example.scss'],
  templateUrl: './table-sorting-example.html',
})
export class DtExampleTableSorting {
  disableSorting = false;

  dataSource = [
    {
      host: 'et-demo-2-win3',
      cpu: 26,
      memoryPerc: 46,
      memoryTotal: 6000000000,
      traffic: 62500000,
    },
    {
      host: 'et-demo-2-win4',
      cpu: 30,
      memoryPerc: 38,
      memoryTotal: 5830000000,
      traffic: 98700000,
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

  sortData(event: DtSortEvent): void {
    const data = this.dataSource.slice();

    data.sort((a, b) => {
      const isAsc = event.direction === 'asc';
      switch (event.active) {
        case 'host':
          return this.compare(a.host, b.host, isAsc);
        case 'cpu':
          return this.compare(a.cpu, b.cpu, isAsc);
        case 'memory':
          return this.compare(a.memoryPerc, b.memoryPerc, isAsc);
        case 'traffic':
          return this.compare(a.traffic, b.traffic, isAsc);
        default:
          return 0;
      }
    });

    this.dataSource = data;
  }

  compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
