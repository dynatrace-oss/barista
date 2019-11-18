/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

import { DtFilterFieldDefaultDataSource } from '@dynatrace/barista-components/filter-field';

@Component({
  selector: 'component-barista-example',
  template: `
    <dt-filter-field
      [dataSource]="_dataSource"
      label="Filter by"
      clearAllLabel="Clear all"
    ></dt-filter-field>
  `,
})
export class FilterFieldDistinctExample {
  private DATA = {
    autocomplete: [
      {
        name: 'AUT',
        autocomplete: ['Linz', 'Vienna', 'Graz'],
        distinct: true,
      },
      {
        name: 'USA',
        autocomplete: ['San Francisco', 'Los Angeles', 'New York'],
      },
    ],
  };

  _dataSource = new DtFilterFieldDefaultDataSource(this.DATA);
}
