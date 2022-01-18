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

import {
  AfterViewInit,
  Component,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { startWith } from 'rxjs/operators';

import { DtPagination } from '@dynatrace/barista-components/pagination';
import { DtTableDataSource } from '@dynatrace/barista-components/table';

@Component({
  selector: 'dt-example-pagination-dynamic-table',
  templateUrl: 'pagination-dynamic-table-example.html',
  styleUrls: ['pagination-dynamic-table-example.scss'],
})
export class DtExamplePaginationDynamicTable implements AfterViewInit {
  show = true;
  private data: Array<{
    host: string;
    cpu: number;
    memory: number;
    traffic: number;
  }> = [
    { host: 'et-demo-2-win4', cpu: 30, memory: 38, traffic: 98700000 },
    { host: 'et-demo-2-win3', cpu: 26, memory: 46, traffic: 62500000 },
    { host: 'docker-host2', cpu: 25.4, memory: 35, traffic: 41900000 },
    { host: 'et-demo-2-win1', cpu: 23, memory: 7.86, traffic: 98700000 },
    { host: 'et-demo-2-win8', cpu: 78, memory: 21, traffic: 91870000 },
    { host: 'et-demo-2-macOS', cpu: 21, memory: 34, traffic: 1200000 },
    { host: 'kyber-host6', cpu: 12.3, memory: 12, traffic: 4500000 },
    { host: 'dev-demo-5-macOS', cpu: 24, memory: 8.6, traffic: 3270000 },
  ];

  @ViewChildren(DtPagination) paginationList: QueryList<DtPagination>;

  dataSource: DtTableDataSource<{
    host: string;
    cpu: number;
    memory: number;
    traffic: number;
  }> = new DtTableDataSource(this.data);

  ngAfterViewInit(): void {
    this.paginationList.changes.pipe(startWith(null)).subscribe(() => {
      if (this.paginationList.first) {
        this.dataSource.pagination = this.paginationList.first;
        this.dataSource.pageSize = 2;
      } else {
        this.dataSource.pagination = null;
      }
    });
  }
}
