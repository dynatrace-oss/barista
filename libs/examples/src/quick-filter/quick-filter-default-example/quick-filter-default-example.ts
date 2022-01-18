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

import { Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { isObject } from '@dynatrace/barista-components/core';
import {
  DtQuickFilterDefaultDataSource,
  DtQuickFilterDefaultDataSourceConfig,
  DtQuickFilterDefaultDataSourceType,
} from '@dynatrace/barista-components/quick-filter';

const filterFieldData: DtQuickFilterDefaultDataSourceType = {
  autocomplete: [
    {
      name: 'Free text',
      suggestions: [],
      unique: true,
      validators: [
        {
          validatorFn: Validators.maxLength(5),
          error: 'Maximum length of 5 reached',
        },
      ],
    },
    {
      name: 'Locations',
      options: [
        {
          name: 'State',
          autocomplete: [
            {
              name: 'Oberösterreich',
              autocomplete: [
                { name: 'Linz' },
                { name: 'Wels' },
                { name: 'Steyr' },
              ],
            },
            {
              name: 'Niederösterreich',

              autocomplete: [
                { name: 'St. Pölten' },
                { name: 'Melk' },
                { name: 'Krems' },
              ],
            },
            {
              name: 'Wien',
            },
            {
              name: 'Tirol',
            },
            {
              name: 'Salzburg',
            },
          ],
        },
        {
          name: 'Custom',
          suggestions: [],
        },
      ],
    },
    {
      name: 'AUT',
      distinct: true,
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
      name: 'Not in Quickfilter',
      autocomplete: [
        { name: 'Option1' },
        { name: 'Option2' },
        { name: 'Option3' },
      ],
    },
    {
      name: 'Long Array',
      async: true,
      distinct: true,
      autocomplete: Array.from(new Array(150), (_, i) => ({
        name: `Option${i + 1}`,
      })),
    },
  ],
};

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
