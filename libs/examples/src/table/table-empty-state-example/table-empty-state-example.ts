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

import { DtSort } from '@dynatrace/barista-components/table';

@Component({
  selector: 'dt-example-table-empty-state',
  styleUrls: ['./table-empty-state-example.scss'],
  templateUrl: './table-empty-state-example.html',
})
export class DtExampleTableEmptyState {
  data: object[] = [
    {
      usersId: 'Alexander@sommers.at',
      sessionCount: 10,
      averageDuration: '13.6ms',
      errors: 6,
      country: 'Austria',
      city: 'Linz',
      browserFamily: 'Chrome',
      device: 'A1688',
    },
    {
      usersId: 'maximilian@mustermann.at',
      sessionCount: 8,
      averageDuration: '9.99ms',
      errors: 0,
      country: 'Austria',
      city: 'Salzburg',
      browserFamily: 'Firefox',
      device: 'A1688',
    },
    {
      usersId: 'karl@winter.at',
      sessionCount: 4,
      averageDuration: '9.55ms',
      errors: 1,
      country: 'Austria',
      city: 'Vienna',
      browserFamily: 'Firefox',
      device: 'A1688',
    },
  ];

  dataSource: object[] = [];
  emptyState = {
    title: 'No data that matches your query',
    message: `Amend the timefrime you're querying within or
    review your query to make your statement less restrictive.`,
  };

  // Get the viewChild to pass the sorter reference to the datasource.
  @ViewChild('sortable', { read: DtSort, static: true }) sortable: DtSort;

  toggleEmptyState(): void {
    this.dataSource = this.dataSource.length ? [] : [...this.data];
  }
}
