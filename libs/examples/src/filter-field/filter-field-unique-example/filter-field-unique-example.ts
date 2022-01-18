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

import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import {
  DtFilterField,
  DtFilterFieldDefaultDataSource,
  DtFilterFieldDefaultDataSourceType,
} from '@dynatrace/barista-components/filter-field';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'dt-example-filter-field-unique',
  templateUrl: 'filter-field-unique-example.html',
})
export class DtExampleFilterFieldUnique implements AfterViewInit, OnDestroy {
  private DATA: DtFilterFieldDefaultDataSourceType = {
    autocomplete: [
      {
        name: 'Unique address',
        suggestions: [],
        validators: [],
        unique: true,
      },
      {
        name: 'Address',
        suggestions: [],
        validators: [],
      },
      {
        name: 'Unique Requests per minute',
        range: {
          operators: {
            range: true,
            equal: true,
            greaterThanEqual: true,
            lessThanEqual: true,
          },
          unit: 's',
        },
        unique: true,
      },
      {
        name: 'Unique colors',
        multiOptions: [
          { name: 'Rainbow' },
          {
            name: 'Warm',
            options: [{ name: 'Red' }, { name: 'Orange' }, { name: 'Yellow' }],
          },
          {
            name: 'Cold',
            options: [{ name: 'Green' }, { name: 'Blue' }, { name: 'Purple' }],
          },
        ],
        unique: true,
      },
    ],
  };

  _dataSource = new DtFilterFieldDefaultDataSource(this.DATA);

  @ViewChild(DtFilterField) filterField: DtFilterField;

  private readonly _destroy$ = new Subject<void>();

  ngAfterViewInit(): void {
    this.filterField.interactionStateChange
      .pipe(takeUntil(this._destroy$))
      .subscribe((state) => {
        console.log('interaction state: ', state);
        console.log(
          'interaction state member: ',
          this.filterField.interactionState,
        );
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
