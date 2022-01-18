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

import { DtSort, DtTableDataSource } from '@dynatrace/barista-components/table';

@Component({
  selector: 'dt-example-bar-indicator-table-example',
  templateUrl: 'bar-indicator-table-example.html',
  styleUrls: ['bar-indicator-table-example.scss'],
})
export class DtExampleBarIndicatorTable implements AfterViewInit {
  data: object[] = [
    {
      webRequestName: '/services/AuthenticationService/',
      totalTimeConsumption: 100,
      avgResponseTime: '1.24 ms',
    },
    {
      webRequestName: 'contact-orange.jsf',
      totalTimeConsumption: 10,
      avgResponseTime: '3.34 ms',
    },
    {
      webRequestName: 'orange-booking-finish.jsf',
      totalTimeConsumption: 4,
      avgResponseTime: '3.55 ms',
    },
    {
      webRequestName: 'service/JourneyService/findlocations',
      totalTimeConsumption: 1,
      avgResponseTime: '2.58 ms',
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
}
