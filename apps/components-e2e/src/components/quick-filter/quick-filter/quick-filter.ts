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
import {
  DtQuickFilterDefaultDataSource,
  DtQuickFilterDefaultDataSourceConfig,
  DtQuickFilterChangeEvent,
} from '@dynatrace/barista-components/quick-filter';
import {
  FILTER_FIELD_TEST_DATA,
  FILTER_FIELD_TEST_DATA_VALIDATORS,
} from '@dynatrace/testing/fixtures';
import { isObject } from 'lodash-es';

const DATA = [FILTER_FIELD_TEST_DATA_VALIDATORS, FILTER_FIELD_TEST_DATA];

const config: DtQuickFilterDefaultDataSourceConfig = {
  showInSidebar: (node) =>
    (isObject(node) as any) && node.name && node.name !== 'Not in Quickfilter',
};

@Component({
  selector: 'dt-e2e-quick-filter',
  templateUrl: 'quick-filter.html',
})
export class DtE2EQuickFilter {
  _dataSource: DtQuickFilterDefaultDataSource<any> =
    new DtQuickFilterDefaultDataSource(DATA[1], config);

  filterChanges(filterEvent: DtQuickFilterChangeEvent<any>): void {
    console.log(filterEvent);
  }

  switchToDataSource(index: number): void {
    this._dataSource = new DtQuickFilterDefaultDataSource(DATA[index], config);
  }
}
