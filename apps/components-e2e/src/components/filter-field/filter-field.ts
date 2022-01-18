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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers, import/no-deprecated
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  DtFilterField,
  DtFilterFieldDefaultDataSource,
  DtFilterFieldDefaultDataSourceType,
} from '@dynatrace/barista-components/filter-field';
import {
  FILTER_FIELD_TEST_DATA,
  FILTER_FIELD_TEST_DATA_VALIDATORS,
} from '@dynatrace/testing/fixtures';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const DATA = [FILTER_FIELD_TEST_DATA_VALIDATORS, FILTER_FIELD_TEST_DATA];

@Component({
  selector: 'dt-e2e-filter-field',
  templateUrl: './filter-field.html',
})
export class DtE2EFilterField implements OnDestroy {
  destroy$ = new Subject<void>();

  _dataSource = new DtFilterFieldDefaultDataSource(DATA[0]);

  @ViewChild(DtFilterField, { static: true })
  _filterfield: DtFilterField<DtFilterFieldDefaultDataSourceType>;

  switchToDatasource(targetIndex: number): void {
    this._dataSource = new DtFilterFieldDefaultDataSource(DATA[targetIndex]);
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

  setupMultiselectEditScenario(): void {
    this._dataSource = new DtFilterFieldDefaultDataSource(DATA[1]);
    const multiselectNoneFilter = [
      DATA[1].autocomplete[3],
      { name: 'None' },
      { name: 'Homemade', options: [{ name: 'Ketchup' }] },
    ];

    this._filterfield.filters = [multiselectNoneFilter];
  }

  formSubmitted = false;
  onSubmit(event: Event): void {
    event.preventDefault();
    this.formSubmitted = true;
    this._changeDetectorRef.markForCheck();
  }
}
