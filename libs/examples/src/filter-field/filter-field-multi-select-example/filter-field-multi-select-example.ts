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
  DtFilterFieldDefaultDataSource,
  DtFilterFieldDefaultDataSourceType,
} from '@dynatrace/barista-components/filter-field';

@Component({
  selector: 'dt-example-filter-field-multi-select',
  templateUrl: 'filter-field-multi-select-example.html',
})
export class DtExampleFilterFieldMultiSelect {
  private DATA: DtFilterFieldDefaultDataSourceType = {
    autocomplete: [
      {
        name: 'Colors',
        multiOptions: [
          { name: 'Rainbow' },
          {
            name: 'Warm',
            options: [{ name: 'Red' }, { name: 'Orange' }, { name: 'Yellow' }],
          },
          {
            name: 'Cold',
            options: [{ name: 'Green' }, { name: 'Blue' }, { name: 'Purple' }],
          },
        ],
      },
      {
        name: 'Locations',
        autocomplete: [
          {
            name: 'Linz',
            multiOptions: [
              { name: 'Pöstlingberg' },
              { name: 'Froschgarten' },
              { name: 'Bachlberg' },
              { name: 'St. Magdalena' },
            ],
          },
          { name: 'Wels' },
        ],
      },
    ],
  };

  _dataSource = new DtFilterFieldDefaultDataSource(this.DATA);
}
