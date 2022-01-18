/**
 * @license
 * Copyright 2021 Dynatrace LLC
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
  DtFilterFieldCurrentFilterChangeEvent,
  DtFilterFieldDefaultDataSource,
} from '@dynatrace/barista-components/filter-field';

/* eslint-disable @typescript-eslint/no-explicit-any */

@Component({
  selector: 'dt-example-filter-field-async',
  templateUrl: 'filter-field-async-example.html',
})
export class DtExampleFilterFieldAsync {
  private DATA = {
    autocomplete: [
      {
        name: 'AUT (async)',
        async: true,
        autocomplete: [],
      },
      {
        name: 'ITA (async, free-text)',
        async: true,
        suggestions: [],
      },
      {
        name: 'USA',
        autocomplete: [
          { name: 'San Francisco' },
          { name: 'Los Angeles' },
          { name: 'New York' },
        ],
      },
    ],
  };

  private ASYNC_DATA = {
    name: 'AUT (async)',
    autocomplete: [{ name: 'Linz' }, { name: 'Vienna' }, { name: 'Graz' }],
  };

  private ASYNC_DATA_2 = {
    name: 'ITA (async, free-text)',
    suggestions: [{ name: 'Rome' }, { name: 'Venice' }],
  };

  _dataSource = new DtFilterFieldDefaultDataSource(this.DATA);

  currentFilterChanged(
    event: DtFilterFieldCurrentFilterChangeEvent<any>,
  ): void {
    if (event.added[0] === this.DATA.autocomplete[0]) {
      // Emulate a http request
      setTimeout(() => {
        this._dataSource.data = this.ASYNC_DATA;
      }, 1000);
    } else if (this.ASYNC_DATA.name === event.currentFilter[0].name) {
      this._dataSource.data = this.ASYNC_DATA;
    }
    if (event.added[0] === this.DATA.autocomplete[1]) {
      // Emulate a http request
      setTimeout(() => {
        this._dataSource.data = this.ASYNC_DATA_2;
      }, 1000);
    } else if (this.ASYNC_DATA_2.name === event.currentFilter[0].name) {
      this._dataSource.data = this.ASYNC_DATA_2;
    }
  }
}
