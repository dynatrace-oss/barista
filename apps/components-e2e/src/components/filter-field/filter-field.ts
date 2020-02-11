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

// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers deprecation
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import {
  Component,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { Validators } from '@angular/forms';

import {
  DtFilterFieldDefaultDataSource,
  DtFilterFieldDefaultDataSourceType,
  DtFilterField,
} from '@dynatrace/barista-components/filter-field';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

const TEST_DATA = {
  autocomplete: [
    {
      name: 'custom normal',
      suggestions: [],
    },
    {
      name: 'custom required',
      suggestions: [],
      validators: [
        { validatorFn: Validators.required, error: 'field is required' },
      ],
    },
    {
      name: 'custom with multiple',
      suggestions: [],
      validators: [
        { validatorFn: Validators.required, error: 'field is required' },
        { validatorFn: Validators.minLength(3), error: 'min 3 characters' },
      ],
    },
    {
      name: 'outer-option',
      autocomplete: [
        {
          name: 'inner-option',
        },
      ],
    },
    {
      name: 'Autocomplete with free text options',
      autocomplete: [
        { name: 'Autocomplete option 1' },
        { name: 'Autocomplete option 2' },
        { name: 'Autocomplete option 3' },
        {
          name: 'Autocomplete free text',
          suggestions: ['Suggestion 1', 'Suggestion 2', 'Suggestion 3'],
          validators: [],
        },
      ],
    },
  ],
};

const TEST_DATA_2 = {
  autocomplete: [
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
  ],
};

export const DATA = [TEST_DATA, TEST_DATA_2];

@Component({
  selector: 'dt-e2e-filter-field',
  templateUrl: './filter-field.html',
})
export class DtE2EFilterField implements OnDestroy {
  destroy$ = new Subject<void>();

  _dataSource = new DtFilterFieldDefaultDataSource<
    DtFilterFieldDefaultDataSourceType
  >(DATA[0]);

  @ViewChild(DtFilterField, { static: true }) _filterfield: DtFilterField<
    DtFilterFieldDefaultDataSourceType
  >;

  switchToDatasource(targetIndex: number): void {
    this._dataSource = new DtFilterFieldDefaultDataSource<
      DtFilterFieldDefaultDataSourceType
    >(DATA[targetIndex]);
  }

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupSecondTestScenario(): void {
    this._dataSource = new DtFilterFieldDefaultDataSource(DATA[1]);
    const linzFilter = [
      DATA[1].autocomplete[0],
      DATA[1].autocomplete[0].autocomplete![0],
    ];

    this._filterfield.filters = [linzFilter];
    this._filterfield.currentTags
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const linzTag = this._filterfield.getTagForFilter(linzFilter);
        if (linzTag) {
          linzTag.editable = false;
          linzTag.deletable = false;
          this._changeDetectorRef.markForCheck();
        }
      });
  }
}
