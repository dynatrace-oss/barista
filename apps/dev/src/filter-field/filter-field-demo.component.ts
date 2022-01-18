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

import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import {
  defaultTagDataForFilterValuesParser,
  DtFilterField,
  DtFilterFieldChangeEvent,
  DtFilterFieldCurrentFilterChangeEvent,
  DtFilterFieldDefaultDataSource,
  DtFilterFieldTag,
  DtFilterFieldTagData,
  DtFilterValue,
} from '@dynatrace/barista-components/filter-field';
import { Subscription } from 'rxjs';
import { COMPLEX_DATA } from './data';
import { KUBERNETES_DATA } from './kubernetes-data';
import { MULTI_SELECT_DATA } from './multi-select';
import { MULTIDIMENSIONAL_ANALYSIS } from './multidimensional-analysis';
import { THREE_LEVELS_NESTED_DATA } from './three-levels-nested-data';
import {
  MULTI_SELECT_DATA_ASYNC,
  MULTI_SELECT_DATA_ASYNC_PARTIAL,
  TEST_DATA,
  TEST_DATA_ASYNC,
  TEST_DATA_ASYNC_2,
  TEST_DATA_ASYNC_FREETEXT,
  TEST_DATA_PARTIAL,
  TEST_DATA_PARTIAL_2,
} from './testdata';

/* eslint-disable @typescript-eslint/no-explicit-any */

const DATA_SETS = new Map<string, any>([
  ['TEST_DATA', TEST_DATA],
  ['KUBERNETES_DATA', KUBERNETES_DATA],
  ['COMPLEX_DATA', COMPLEX_DATA],
  ['MULTI_SELECT_DATA', MULTI_SELECT_DATA],
  ['MULTIDIMENSIONAL_ANALYSIS', MULTIDIMENSIONAL_ANALYSIS],
  ['THREE_LEVELS_NESTED_DATA', THREE_LEVELS_NESTED_DATA],
]);

// Different object reference
const usFree = [
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
  { name: 'philly' },
] as any;

// const usOption = [
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

const range = [
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
  private _timerHandle: number;
  private _partialFilter: boolean;
  _firstTag: DtFilterFieldTag;

  _dataSource = new DtFilterFieldDefaultDataSource(TEST_DATA);
  _loading = false;
  _disabled = false;
  _filters;
  _useCustomEditorParser: boolean;

  ngAfterViewInit(): void {
    // Hack so we can read and interact with the filter-field
    (window as any).filterField = this.filterField;

    this.filterField.currentTags.subscribe((tags) => {
      if (tags.length) {
        this._firstTag = tags[0];
      }
    });

    this.filterField.interactionStateChange.subscribe((isInteracted) => {
      console.log('interactionState: ', isInteracted);
    });
  }

  ngOnDestroy(): void {
    this._tagChangesSub.unsubscribe();
  }

  filterChanges(event: DtFilterFieldChangeEvent<any>): void {
    this._filters = event.filters;
  }

  currentFilterChanges(
    event: DtFilterFieldCurrentFilterChangeEvent<any>,
  ): void {
    // Cancel current timer if running
    clearTimeout(this._timerHandle);

    this._partialFilter = false;
    if (event.currentFilter[0] === TEST_DATA.autocomplete[3]) {
      // Simulate async data loading
      this._timerHandle = setTimeout(() => {
        this._dataSource.data = TEST_DATA_ASYNC;
      }, 2000);
    } else if (event.currentFilter[0] === TEST_DATA.autocomplete[4]) {
      // Simulate async data loading
      this._timerHandle = setTimeout(() => {
        this._dataSource.data = TEST_DATA_ASYNC_2;
      }, 2000);
    } else if (event.currentFilter[0] === TEST_DATA.autocomplete[5]) {
      // Simulate async data loading
      this._timerHandle = setTimeout(() => {
        this._dataSource.data = TEST_DATA_ASYNC_FREETEXT;
      }, 2000);
    } else if (event.currentFilter[0] === TEST_DATA.autocomplete[6]) {
      this._partialFilter = true;
      // Simulate async data loading
      this._timerHandle = setTimeout(() => {
        this._dataSource.data = TEST_DATA_PARTIAL;
      }, 2000);
    } else if (event.currentFilter[0] === MULTI_SELECT_DATA.autocomplete[0]) {
      // Simulate async data loading
      this._timerHandle = setTimeout(() => {
        this._dataSource.data = MULTI_SELECT_DATA_ASYNC;
      }, 2000);
    } else if (event.currentFilter[0] === MULTI_SELECT_DATA.autocomplete[3]) {
      this._partialFilter = true;
      // Simulate async data loading
      this._timerHandle = setTimeout(() => {
        this._dataSource.data = MULTI_SELECT_DATA_ASYNC_PARTIAL;
      }, 2000);
    }
  }

  inputChange(inputText: string): void {
    // Cancel current timer if running
    clearTimeout(this._timerHandle);

    if (this._partialFilter && inputText.length > 0) {
      // Explicitly set loading state, as the automatic loading state only works with async, not partial
      this.filterField.loading = true;
      // Simulate partial data loading where we would pass inputText along
      this._timerHandle = setTimeout(() => {
        this._dataSource.data = TEST_DATA_PARTIAL_2;
      }, 1000);
    }
  }

  toggledDisableFirstTag(): void {
    if (this._firstTag) {
      this._firstTag.disabled = !this._firstTag.disabled;
    }
  }

  toggledDisableEditableFirstTag(): void {
    if (this._firstTag) {
      this._firstTag.editable = !this._firstTag.editable;
    }
  }

  toggledDisableDeletableFirstTag(): void {
    if (this._firstTag) {
      this._firstTag.deletable = !this._firstTag.deletable;
    }
  }

  setValues(): void {
    if (this._dataSource.data === TEST_DATA) {
      this.filterField.filters = [
        // AUT Vienna
        [TEST_DATA.autocomplete[0], TEST_DATA.autocomplete[0].autocomplete![1]],
        // Range
        [
          TEST_DATA.autocomplete[6],
          {
            operator: 'range',
            range: [2, 3],
            unit: 's',
          },
        ],
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

        // usFree,
        // range,

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

  filters = [
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
  ];

  getTagForFilter(): void {
    const rangeTag = this.filterField.getTagForFilter(range);
    rangeTag!.deletable = false;
    const freeTag = this.filterField.getTagForFilter(usFree);
    freeTag!.editable = false;
  }
  getEditionForFilter(): void {
    this._useCustomEditorParser = !this._useCustomEditorParser;
  }

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
      tagData.key = '❤ ' + tagData.key;
    }
    return tagData;
  }

  customEditionParser(filterValues: DtFilterValue[]): string {
    return (
      '✏ ' +
      (filterValues?.map((value: any) => value.data.name).join('.') ??
        'no data')
    );
  }

  setDeletableFirstTag(): void {
    if (this._firstTag) {
      this._firstTag.deletable = !this._firstTag.deletable;
    }
  }

  toggleDeletableAll(): void {
    this.filterField.currentTags.forEach((tags) => {
      tags.forEach((tag) => {
        tag.deletable = !tag.deletable;
      });
    });
  }

  addTagProgramatically(): void {
    const filters = [
      [TEST_DATA.autocomplete[1], TEST_DATA.autocomplete[1].autocomplete![0]],
    ];
    this.filterField.filters = filters;
  }
}
