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

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Directive,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  DtFilterField,
  DtFilterFieldChangeEvent,
  DtFilterFieldDataSource,
} from '@dynatrace/barista-components/filter-field';
import { Action, switchDataSource } from './state/actions';
import { quickFilterReducer } from './state/reducer';
import { getAutocompletes, getDataSource } from './state/selectors';
import { createQuickFilterStore } from './state/store';

@Directive({
  selector: 'dt-quick-filter-title',
  exportAs: 'dtQuickFilterTitle',
  host: {
    class: 'dt-quick-filter-title',
  },
})
export class DtQuckFilterTitle {}

@Directive({
  selector: 'dt-quick-filter-sub-title',
  exportAs: 'dtQuickFilterSubTitle',
  host: {
    class: 'dt-quick-filter-sub-title',
  },
})
export class DtQuckFilterSubTitle {}

@Component({
  selector: 'dt-quick-filter',
  exportAs: 'dtQuickFilter',
  templateUrl: 'quick-filter.html',
  styleUrls: ['quick-filter.scss'],
  host: {
    class: 'dt-quick-filter',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtQuickFilter<T> implements AfterViewInit {
  @Output() readonly filterChanges = new EventEmitter<
    DtFilterFieldChangeEvent<T>
  >();

  @ViewChild(DtFilterField, { static: true })
  private _filterField: DtFilterField<any>;

  /** The data source instance that should be connected to the filter field. */
  @Input()
  get dataSource(): DtFilterFieldDataSource {
    return this._dataSource;
  }
  set dataSource(dataSource: DtFilterFieldDataSource) {
    this._store.dispatch(switchDataSource(dataSource));
  }
  private _dataSource: DtFilterFieldDataSource;

  private _store = createQuickFilterStore(quickFilterReducer);

  /** @internal */
  _autocompleteData$ = this._store.select(getAutocompletes);

  _filterFieldDataSource$ = this._store.select(getDataSource);

  constructor() {}

  ngAfterViewInit(): void {
    console.log('Filters set: ', this._filterField.filters);
  }

  _changeFilter(_action: Action): void {
    // this._filterField.filters = quickFilterReducer(
    //   this._filterField.filters,
    //   action,
    // );
  }

  /** @internal Bubble the filter field change event through */
  _filterFiledChanged(change: DtFilterFieldChangeEvent<T>): void {
    console.log(change);

    this.filterChanges.emit(change);
  }
}
