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
import {
  DtFilterField,
  DtFilterFieldDefaultDataSource,
} from '@dynatrace/barista-components/filter-field';

@Component({
  selector: 'dt-example-filter-field-clearall',
  templateUrl: 'filter-field-clearall-example.html',
})
export class DtExampleFilterFieldClearall<T> {
  @ViewChild(DtFilterField, { static: true }) filterField: DtFilterField<T>;
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
          { name: 'Custom', suggestions: [] },
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
    ],
  };

  private _linzFilter = [
    this.DATA.autocomplete[0],
    this.DATA.autocomplete[0].autocomplete![0],
  ];
  _filters = [this._linzFilter];

  _dataSource = new DtFilterFieldDefaultDataSource(this.DATA);
}
