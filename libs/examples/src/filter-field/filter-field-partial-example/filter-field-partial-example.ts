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

import { Component, ViewChild } from '@angular/core';
import {
  DtFilterField,
  DtFilterFieldCurrentFilterChangeEvent,
  DtFilterFieldDefaultDataSource,
} from '@dynatrace/barista-components/filter-field';

/* eslint-disable @typescript-eslint/no-explicit-any */

@Component({
  selector: 'dt-example-filter-field-partial',
  templateUrl: 'filter-field-partial-example.html',
})
export class DtExampleFilterFieldPartial {
  @ViewChild(DtFilterField, { static: true }) filterField: DtFilterField<any>;

  private DATA = {
    autocomplete: [
      {
        name: 'AUT',
        autocomplete: [{ name: 'Linz' }, { name: 'Vienna' }, { name: 'Graz' }],
      },
      {
        name: 'CH (async, partial)',
        async: true,
        autocomplete: [],
      },
    ],
  };

  private DATA_PARTIAL = {
    name: 'CH (async, partial)',
    autocomplete: [
      { name: 'Zürich' },
      { name: 'Genf' },
      { name: 'Basel' },
      { name: 'Bern' },
    ],
    partial: true,
  };

  private DATA_PARTIAL_2 = {
    name: 'CH (async, partial)',
    autocomplete: [
      { name: 'Zug' },
      { name: 'Schaffhausen' },
      { name: 'Luzern' },
      { name: 'St. Gallen' },
    ],
    partial: true,
  };

  private currentAddedFilter;

  _dataSource = new DtFilterFieldDefaultDataSource(this.DATA);

  currentFilterChanged(
    event: DtFilterFieldCurrentFilterChangeEvent<any>,
  ): void {
    this.currentAddedFilter = event.added[0];
    if (this.currentAddedFilter === this.DATA.autocomplete[1]) {
      // Emulate loading a partial result with a http request
      setTimeout(() => {
        this._dataSource.data = this.DATA_PARTIAL;
      }, 1000);
    }
  }

  inputChange(textInput: string): void {
    if (
      this.currentAddedFilter === this.DATA.autocomplete[1] &&
      textInput.length > 0
    ) {
      // Explicitly set loading state, as the automatic loading state only works with async, not partial
      this.filterField.loading = true;
      // Emulate loading a partial result filtered by textInput with a http request
      setTimeout(() => {
        this._dataSource.data = this.DATA_PARTIAL_2;
      }, 1000);
    }
  }
}
