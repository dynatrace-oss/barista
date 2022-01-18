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
import { DtQuickFilterDefaultDataSource } from '@dynatrace/barista-components/quick-filter';

@Component({
  selector: 'dt-example-quick-filter-custom-show-more',
  templateUrl: 'quick-filter-custom-show-more-example.html',
})
export class DtExampleQuickFilterCustomShowMore {
  _dataSource = new DtQuickFilterDefaultDataSource({
    autocomplete: [
      {
        name: 'Value',
        distinct: true,
        autocomplete: Array.from(new Array(1000), (_, i) => ({
          name: `Value ${i + 1}`,
        })),
      },
      {
        name: 'Country',
        distinct: false,
        autocomplete: Array.from(new Array(30), (_, i) => ({
          name: `State ${i + 1}`,
        })),
      },
    ],
  });
}
