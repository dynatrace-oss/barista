/**
 * @license
 * Copyright 2020 Dynatrace LLC
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
} from '@dynatrace/barista-components/experimental/quick-filter';
import { FILTER_FIELD_TEST_DATA as filterFieldData } from '@dynatrace/testing/fixtures';

@Component({
  selector: 'dt-example-quick-filter-default',
  templateUrl: 'quick-filter-default-example.html',
})
export class DtExampleQuickFilterDefault {
  /** configuration for the quick filter */
  private _config: DtQuickFilterDefaultDataSourceConfig = {
    // Method to decide if a node should be displayed in the quick filter
    showInSidebar: (node) =>
      isObject(node) && node.name && node.name !== 'Not in Quickfilter',
  };

  _dataSource = new DtQuickFilterDefaultDataSource(
    filterFieldData,
    this._config,
  );
}
