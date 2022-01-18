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

import { AfterViewInit, Component, ViewChild } from '@angular/core';

import {
  DT_TABLE_SELECTION_CONFIG,
  DtSort,
  DtTableDataSource,
  DtTableSelection,
} from '@dynatrace/barista-components/table';
import { isNil } from 'lodash-es';

interface Row {
  host: string;
  cpu: number;
}

@Component({
  selector: 'dt-example-table-selectable-column',
  templateUrl: './table-selection-example.html',
  styleUrls: ['./table-selection-example.scss'],
  providers: [
    {
      provide: DT_TABLE_SELECTION_CONFIG,
      useValue: { selectionLimit: 5 },
    },
  ],
})
export class DtExampleTableSelection implements AfterViewInit {
  data: Row[] = [
    {
      host: 'et-demo-2-win4',
      cpu: 30,
    },
    {
      host: 'et-demo-2-win3',
      cpu: 26,
    },
    {
      host: 'docker-host2',
      cpu: 25.4,
    },
    {
      host: 'et-demo-2-win1',
      cpu: 23,
    },
    {
      host: 'et-demo-2-win5',
      cpu: 23,
    },
    {
      host: 'et-demo-2-win6',
      cpu: 23,
    },
    {
      host: 'et-demo-2-win7',
      cpu: 23,
    },
    {
      host: 'et-demo-2-win8',
      cpu: 23,
    },
    {
      host: 'my host (disabled)',
      cpu: 13,
    },
  ];

  // Get the viewChild to pass the sorter reference to the datasource.
  @ViewChild(DtSort, { read: DtSort, static: true }) sortable: DtSort;
  @ViewChild(DtTableSelection, { read: DtTableSelection, static: true })
  selection: DtTableSelection<Row>;

  // Initialize the table's data source
  dataSource: DtTableDataSource<Row>;
  constructor() {
    this.dataSource = new DtTableDataSource(this.data);
  }

  ngAfterViewInit(): void {
    // Set the dtSort reference on the dataSource, so it can react to sorting.
    this.dataSource.sort = this.sortable;
  }

  getCurrentSelection(): string {
    return this.selection.selected.map((data: Row) => data.host).join(', ');
  }

  isDisabled(entry: { host: string; cpu: number }): boolean {
    return entry.host.endsWith('(disabled)');
  }

  getAriaLabel(value: Row | undefined): string {
    if (isNil(value)) {
      return 'Select hosts';
    }
    return 'Select ' + value!.host;
  }
}
