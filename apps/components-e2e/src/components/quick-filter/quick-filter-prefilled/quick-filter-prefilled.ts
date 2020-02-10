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
import { DATA } from '../../filter-field/filter-field';

@Component({
  selector: 'dt-e2e-quick-filter-prefilled',
  templateUrl: 'quick-filter-prefilled.html',
})
export class DtE2EQuickFilterPrefilled {
  _dataSource = new DtFilterFieldDefaultDataSource<
    DtFilterFieldDefaultDataSourceType
  >(DATA[1]);

  // ngAfterViewInit(): void {

  //   console.log(this._filterField)
  //   this._filterField.filters = [
  //     [DATA[1].autocomplete[0], DATA[1].autocomplete[0][1]],
  //   ];
  // }
}

// const TEST_DATA_2 = {
//   autocomplete: [
//     {
//       name: 'AUT',
//       distinct: true,
//       autocomplete: [{ name: 'Linz' }, { name: 'Vienna' }, { name: 'Graz' }],
//     },
