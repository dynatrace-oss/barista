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
import { DtFilterFieldDefaultDataSource } from '@dynatrace/barista-components/filter-field';

@Component({
  selector: 'dt-example-filter-field-default',
  templateUrl: 'filter-field-default-example.html',
})
export class DtExampleFilterFieldDefault {
  private DATA = {
    autocomplete: [
      {
        name: 'items',
        autocomplete: [
          { name: 'first item' },
          { name: 'second item' },
          { name: 'third item' },
          { name: 'fourth item' },
          { name: 'fifth item' },
          { name: 'sixth item' },
          { name: 'seventh item' },
          { name: 'eighth item' },
          { name: 'ninth item' },
          { name: 'tenth item' },
          { name: 'eleventh item' },
          { name: 'twelfth item' },
          { name: 'some very long item' },
          { name: 'some even much longer item' },
        ],
      },
    ],
  };

  _dataSource = new DtFilterFieldDefaultDataSource(this.DATA);
}
