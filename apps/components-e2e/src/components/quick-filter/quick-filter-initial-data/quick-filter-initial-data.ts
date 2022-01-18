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
import { DtQuickFilterDefaultDataSource } from '@dynatrace/barista-components/quick-filter';
import { FILTER_FIELD_TEST_DATA } from '@dynatrace/testing/fixtures';

@Component({
  selector: 'dt-e2e-quick-filter',
  templateUrl: 'quick-filter-initial-data.html',
})
export class DtE2EQuickFilterInitialData {
  _dataSource = new DtQuickFilterDefaultDataSource(FILTER_FIELD_TEST_DATA, {
    showInSidebar: () => true,
  });

  _initialFilters = [
    [
      FILTER_FIELD_TEST_DATA.autocomplete[0],
      FILTER_FIELD_TEST_DATA.autocomplete[0].autocomplete![1],
    ],
    [
      FILTER_FIELD_TEST_DATA.autocomplete[1],
      FILTER_FIELD_TEST_DATA.autocomplete[1].autocomplete![2],
    ],
  ];

  changeInitialFilters(): void {
    this._initialFilters = [
      [
        FILTER_FIELD_TEST_DATA.autocomplete[1],
        FILTER_FIELD_TEST_DATA.autocomplete[1].autocomplete![2],
      ],
    ];
  }
}
