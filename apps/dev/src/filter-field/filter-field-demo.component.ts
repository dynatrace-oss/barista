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

import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  DtFilterField,
  DtFilterFieldCurrentFilterChangeEvent,
  DtFilterFieldDefaultDataSource,
  DtFilterFieldTag,
} from '@dynatrace/barista-components/filter-field';

import { COMPLEX_DATA } from './data';
import { KUBERNETES_DATA } from './kubernetes-data';
import { MULTIDIMENSIONAL_ANALYSIS } from './multidimensional-analysis';
import { TEST_DATA, TEST_DATA_ASYNC, TEST_DATA_ASYNC_2 } from './testdata';

// tslint:disable:no-any

const DATA_SETS = new Map<string, any>([
  ['TEST_DATA', TEST_DATA],
  ['KUBERNETES_DATA', KUBERNETES_DATA],
  ['COMPLEX_DATA', COMPLEX_DATA],
  ['MULTIDIMENSIONAL_ANALYSIS', MULTIDIMENSIONAL_ANALYSIS],
]);

// Different object reference
const blaFree = [
  {
    name: 'US',
    autocomplete: [
      {
        name: 'Miami',
      },
      {
        name: 'Los Angeles',
      },
      {
        name: 'custom',
        suggestions: [],
      },
    ],
  },
  {
    name: 'custom',
    suggestions: [],
  },
  'philly',
] as any;

// const blaOption = [
//   {
//     name: 'US',
//     autocomplete: [
//       {
//         name: 'Miami',
//       },
//       {
//         name: 'Los Angeles',
//       },
//       {
//         name: 'custom',
//         suggestions: [],
//       },
//     ],
//   },
//   {
//     name: 'Miami',
//   },
// ] as any;

const blaRange = [
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
    operator: 'range',
    range: [1.01, 2],
    unit: 's',
  },
] as any;

@Component({
  selector: 'filter-field-dev-app-demo',
  templateUrl: './filter-field-demo.component.html',
  styleUrls: ['./filter-field-demo.component.scss'],
})
export class FilterFieldDemo implements AfterViewInit, OnDestroy {
  get dataSourceNames(): string[] {
    return Array.from(DATA_SETS.keys());
  }

  get activeDataSourceName(): string {
    return this._activeDataSourceName;
  }
  set activeDataSourceName(value: string) {
    this._dataSource.data = DATA_SETS.get(value);
    this._activeDataSourceName = value;
  }

  get canSetValues(): boolean {
    return this._dataSource.data === TEST_DATA;
  }

  @ViewChild(DtFilterField, { static: true }) filterField: DtFilterField<any>;

  private _activeDataSourceName = 'TEST_DATA';
  private _tagChangesSub = Subscription.EMPTY;
  _firstTag: DtFilterFieldTag;

  _dataSource = new DtFilterFieldDefaultDataSource<any>(TEST_DATA);
  _loading = false;

  ngAfterViewInit(): void {
    this.filterField.currentTags.subscribe(tags => {
      if (tags.length) {
        this._firstTag = tags[0];
      }
    });
  }

  ngOnDestroy(): void {
    this._tagChangesSub.unsubscribe();
  }

  filterChanges(event: any): void {
    console.log(event);
  }

  currentFilterChanges(
    event: DtFilterFieldCurrentFilterChangeEvent<any>,
  ): void {
    if (event.currentFilter[0] === TEST_DATA.autocomplete[2]) {
      // Simulate async data loading
      setTimeout(() => {
        this._dataSource.data = TEST_DATA_ASYNC;
      }, 2000);
    } else if (event.currentFilter[0] === TEST_DATA.autocomplete[3]) {
      // Simulate async data loading
      setTimeout(() => {
        this._dataSource.data = TEST_DATA_ASYNC_2;
      }, 2000);
    }
  }

  toggledDisableFirstTag(): void {
    if (this._firstTag) {
      this._firstTag.disabled = !this._firstTag.disabled;
    }
  }

  setValues(): void {
    if (this._dataSource.data === TEST_DATA) {
      this.filterField.filters = [
        // // Free text
        // [
        //   TEST_DATA.autocomplete[0],
        //   TEST_DATA.autocomplete[0].autocomplete![2],
        //   'foo',
        // ],

        // // async data
        // [TEST_DATA.autocomplete[2], (TEST_DATA_ASYNC as any).autocomplete[0]],

        // // option as a string
        // [TEST_DATA.autocomplete[0], TEST_DATA.autocomplete[0].autocomplete![1]],

        blaFree,
        blaRange,

        // Range
        // [
        //   TEST_DATA.autocomplete[4],
        //   {
        //     operator: 'range',
        //     range: [1.01, 2],
        //     unit: 's',
        //   },
        // ],
      ];
    }
  }
  getTagForFilter(): void {
    const rangeTag = this.filterField.getTagForFilter(blaRange);
    rangeTag!.deletable = false;
    const freeTag = this.filterField.getTagForFilter(blaFree);
    freeTag!.editable = false;
  }
}
