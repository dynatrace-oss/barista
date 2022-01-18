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
  selector: 'dt-example-filter-field-read-only-tags',
  templateUrl: 'filter-field-readonly-non-editable-tags-example.html',
})
export class DtExampleFilterFieldReadOnlyTags<T> implements AfterViewInit {
  @ViewChild(DtFilterField, { static: true }) filterField: DtFilterField<T>;
  private DATA = {
    autocomplete: [
      {
        name: 'AUT',
        autocomplete: [
          { name: 'Linz' },
          { name: 'Vienna' },
          { name: 'Graz' },
          { name: 'Bregenz' },
        ],
      },
      {
        name: 'USA',
        autocomplete: [
          { name: 'San Francisco' },
          { name: 'Los Angeles' },
          { name: 'New York' },
          { name: 'Custom', suggestions: [], validators: [] },
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
        name: 'Colors',
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
      },
    ],
  };

  private _linzFilter = [
    this.DATA.autocomplete[0],
    this.DATA.autocomplete[0].autocomplete![0],
  ];
  private _viennaFilter = [
    this.DATA.autocomplete[0],
    this.DATA.autocomplete[0].autocomplete![1],
  ];
  private _grazFilter = [
    this.DATA.autocomplete[0],
    this.DATA.autocomplete[0].autocomplete![2],
  ];
  private _bregenzFilter = [
    this.DATA.autocomplete[0],
    this.DATA.autocomplete[0].autocomplete![3],
  ];
  private _miamiFilter = [
    this.DATA.autocomplete[1],
    this.DATA.autocomplete[1].autocomplete![3],
    'Miami',
  ];
  private _austinFilter = [
    this.DATA.autocomplete[1],
    this.DATA.autocomplete[1].autocomplete![3],
    'Austin',
  ];
  private _sandiegoFilter = [
    this.DATA.autocomplete[1],
    this.DATA.autocomplete[1].autocomplete![3],
    'San Diego',
  ];
  private _bendFilter = [
    this.DATA.autocomplete[1],
    this.DATA.autocomplete[1].autocomplete![3],
    'Bend',
  ];
  _filters = [
    this._linzFilter,
    this._viennaFilter,
    this._grazFilter,
    this._bregenzFilter,
    this._miamiFilter,
    this._austinFilter,
    this._sandiegoFilter,
    this._bendFilter,
  ];

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
      const viennaTag = this.filterField.getTagForFilter(this._viennaFilter);
      if (viennaTag) {
        viennaTag.editable = true;
        viennaTag.deletable = false;
        this._changeDetectorRef.markForCheck();
      }
      const grazTag = this.filterField.getTagForFilter(this._grazFilter);
      if (grazTag) {
        grazTag.editable = false;
        grazTag.deletable = true;
        this._changeDetectorRef.markForCheck();
      }
      const bregenz = this.filterField.getTagForFilter(this._bregenzFilter);
      if (bregenz) {
        bregenz.editable = true;
        bregenz.deletable = true;
        this._changeDetectorRef.markForCheck();
      }
      // Permutation for free texts as well
      const miami = this.filterField.getTagForFilter(this._miamiFilter);
      if (miami) {
        miami.editable = false;
        miami.deletable = false;
        this._changeDetectorRef.markForCheck();
      }
      const austin = this.filterField.getTagForFilter(this._austinFilter);
      if (austin) {
        austin.editable = true;
        austin.deletable = false;
        this._changeDetectorRef.markForCheck();
      }
      const sandiego = this.filterField.getTagForFilter(this._sandiegoFilter);
      if (sandiego) {
        sandiego.editable = false;
        sandiego.deletable = true;
        this._changeDetectorRef.markForCheck();
      }
      const bend = this.filterField.getTagForFilter(this._bendFilter);
      if (bend) {
        bend.editable = true;
        bend.deletable = true;
        this._changeDetectorRef.markForCheck();
      }
    });
  }
}
