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

import {
  DtFilterFieldDefaultDataSource,
  DtFilterFieldDefaultDataSourceType,
} from '@dynatrace/barista-components/filter-field';

@Component({
  selector: 'dt-example-filter-field-default',
  templateUrl: 'filter-field-default-example.html',
})
export class DtExampleFilterFieldDefault {
  private DATA = {
    autocomplete: [
      {
        name: 'AUT',
        autocomplete: [{ name: 'Linz' }, { name: 'Vienna' }, { name: 'Graz' }],
      },
      {
        name: 'USA',
        autocomplete: [
          { name: 'San Francisco' },
          { name: 'Los Angeles' },
          { name: 'New York' },
          { name: 'Custom', suggestions: [], validators: [] },
        ],
      },
      {
        name: 'Requests per minute',
        range: {
          operators: {
            range: true,
            equal: true,
            greaterThanEqual: true,
            lessThanEqual: true,
          },
          unit: 's',
        },
      },
    ],
  };

  _dataSource = new DtFilterFieldDefaultDataSource<
    DtFilterFieldDefaultDataSourceType
  >(this.DATA);
}
