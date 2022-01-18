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
  selector: 'dt-example-filter-field-default-search',
  templateUrl: 'filter-field-default-search-example.html',
})
export class DtExampleFilterFieldDefaultSearch
  implements AfterViewInit, OnDestroy
{
  private DATA: DtFilterFieldDefaultDataSourceType = {
    autocomplete: [
      {
        name: 'Asia',
        defaultSearch: true,
        suggestions: [
          { name: 'Australia' },
          { name: 'China' },
          { name: 'India' },
        ],
        validators: [],
      },
      {
        name: 'Europe',
        distinct: true,
        autocomplete: [
          {
            name: 'Austria',
            autocomplete: [
              {
                name: 'Upper Austria',
                autocomplete: [
                  {
                    name: 'Linz',
                  },
                ],
              },
              {
                name: 'Vienna',
                autocomplete: [
                  {
                    name: 'Districts',
                    range: {
                      operators: {
                        range: true,
                      },
                      unit: ' district',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'North America',
        autocomplete: [
          {
            name: 'USA',
            autocomplete: [
              {
                name: 'California',
                autocomplete: [
                  {
                    name: 'San Francisco',
                  },
                  {
                    name: 'Los Angeles',
                  },
                ],
              },
              {
                name: 'New York',
                autocomplete: [
                  {
                    name: 'New York',
                  },
                ],
              },
            ],
          },
        ],
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
