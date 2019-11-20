/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';

import {
  DtFilterField,
  DtFilterFieldDefaultDataSource,
} from '@dynatrace/barista-components/filter-field';

@Component({
  selector: 'component-barista-example',
  template: `
    <dt-filter-field
      [dataSource]="_dataSource"
      [filters]="_filters"
      label="Filter by"
      aria-label="Filter By Inputvalue"
      clearAllLabel="Clear all"
    ></dt-filter-field>
  `,
})
export class FilterFieldReadOnlyTagsExample<T> implements AfterViewInit {
  @ViewChild(DtFilterField, { static: true }) filterField: DtFilterField<T>;
  private DATA = {
    autocomplete: [
      {
        name: 'AUT',
        autocomplete: ['Linz', 'Vienna', 'Graz'],
      },
      {
        name: 'USA',
        autocomplete: [
          'San Francisco',
          'Los Angeles',
          'New York',
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
    ],
  };

  private _linzFilter = [
    this.DATA.autocomplete[0],
    this.DATA.autocomplete[0].autocomplete![0],
  ];
  _filters = [this._linzFilter];

  _dataSource = new DtFilterFieldDefaultDataSource(this.DATA);

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.filterField.currentTags.subscribe(() => {
      const linzTag = this.filterField.getTagForFilter(this._linzFilter);
      if (linzTag) {
        linzTag.editable = false;
        linzTag.deletable = false;
        this._changeDetectorRef.markForCheck();
      }
    });
  }
}
