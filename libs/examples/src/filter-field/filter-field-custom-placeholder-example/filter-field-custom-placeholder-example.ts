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
  DtFilterValue,
  DtFilterFieldDefaultDataSource,
} from '@dynatrace/barista-components/filter-field';

@Component({
  selector: 'dt-example-filter-field-filter-field-custom-placeholder',
  templateUrl: 'filter-field-custom-placeholder-example.html',
})
export class DtExampleFilterFieldCustomPlaceholder {
  private DATA = {
    name: 'Category',
    value: 'category',
    autocomplete: [
      {
        name: 'Locations',
        options: [
          {
            name: 'State',
            value: 'state',
            distinct: true,
            autocomplete: [
              {
                name: 'Oberösterreich',
                value: 'OOE',
                autocomplete: [
                  {
                    name: 'Linz',
                    value: 'linz',
                    autocomplete: [
                      { name: 'Pöstlingberg' },
                      { name: 'Froschgarten' },
                      { name: 'Bachlberg' },
                      { name: 'St. Magdalena' },
                    ],
                  },
                  { name: 'Wels' },
                  { name: 'Steyr' },
                  { name: 'Leonding' },
                  { name: 'Traun' },
                  { name: 'Vöcklabruck' },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  _dataSource = new DtFilterFieldDefaultDataSource(this.DATA);

  // constructor(private _changeDetectorRef: ChangeDetectorRef) { }

  customParser(filterValues: DtFilterValue[]): string {
    return (
      '✏ ' +
      (filterValues?.map((value: any) => value.data.name).join('.') ??
        'no data')
    );
  }
}
