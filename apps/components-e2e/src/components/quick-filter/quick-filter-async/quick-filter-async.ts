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
import { isObject } from '@dynatrace/barista-components/core';
import {
  DtQuickFilterDefaultDataSource,
  DtQuickFilterDefaultDataSourceConfig,
  DtQuickFilterCurrentFilterChangeEvent,
  DtQuickFilterDefaultDataSourceType,
} from '@dynatrace/barista-components/quick-filter';

const filterFieldData = {
  autocomplete: [
    {
      name: 'AUT (async)',
      async: true,
      autocomplete: [],
    },
    {
      name: 'USA',
      autocomplete: [
        { name: 'San Francisco' },
        { name: 'Los Angeles' },
        { name: 'New York' },
      ],
    },
  ],
};

const asyncData = {
  name: 'AUT (async)',
  autocomplete: [{ name: 'Linz' }, { name: 'Vienna' }, { name: 'Graz' }],
};

@Component({
  selector: 'dt-e2e-quick-filter-async',
  templateUrl: './quick-filter-async.html',
  // template: ''
})
export class DtE2EQuickFilterAsync {
  /** configuration for the quick filter */
  private _config: DtQuickFilterDefaultDataSourceConfig = {
    // Method to decide if a node should be displayed in the quick filter
    showInSidebar: (node) =>
      isObject(node) && node.name && node.name !== 'AUT (async)',
  };

  _dataSource =
    new DtQuickFilterDefaultDataSource<DtQuickFilterDefaultDataSourceType>(
      filterFieldData,
      this._config,
    );

  currentFilterChanges(
    event: DtQuickFilterCurrentFilterChangeEvent<DtQuickFilterDefaultDataSourceType>,
  ): void {
    if (event.added[0] === filterFieldData.autocomplete[0]) {
      setTimeout(() => {
        this._dataSource.data = asyncData;
      }, 1000);
    }
  }
}
