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
} from '@dynatrace/barista-components/quick-filter';
import {
  DtFilterValue,
  DtFilterFieldTagData,
  defaultTagDataForFilterValuesParser,
  isDtAutocompleteValue,
} from '@dynatrace/barista-components/filter-field';

const filterFieldData = {
  autocomplete: [
    {
      name: 'Locations',
      options: [
        {
          name: 'State',
          value: 'state',
          autocomplete: [
            {
              name: 'Oberösterreich',
              value: 'OOE',
              autocomplete: [
                { name: 'Linz' },
                { name: 'Wels' },
                { name: 'Steyr' },
              ],
            },
            {
              name: 'Niederösterreich',
              value: 'NOE',
              autocomplete: [
                { name: 'St. Pölten' },
                { name: 'Melk' },
                { name: 'Krems' },
              ],
            },
            {
              name: 'Wien',
              value: 'W',
            },
            {
              name: 'Tirol',
              value: 'TRL',
            },
            {
              name: 'Salzburg',
              value: 'SBZ',
            },
          ],
        },
        {
          name: 'Custom',
          value: 'custom-location',
          suggestions: [],
        },
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

@Component({
  selector: 'dt-example-quick-filter-custom-parser',
  templateUrl: 'quick-filter-custom-parser-example.html',
})
export class DtExampleQuickFilterCustomParser {
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

  customParser(
    filterValues: DtFilterValue[],
    editable?: boolean,
    deletable?: boolean,
  ): DtFilterFieldTagData | null {
    const tagData = defaultTagDataForFilterValuesParser(
      filterValues,
      editable,
      deletable,
    );
    if (tagData) {
      let isFirstValue = true;
      for (const filterValue of filterValues) {
        if (isDtAutocompleteValue(filterValue)) {
          if (isFirstValue && filterValues.length > 1) {
            tagData.key = filterValue.option.viewValue;
          } else if (filterValue.autocomplete && filterValues.length > 1) {
            tagData.key = tagData.key + '.' + filterValue.option.viewValue;
          }
          isFirstValue = false;
        }
      }
    }
    return tagData;
  }
}
