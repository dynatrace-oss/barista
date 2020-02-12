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
  OnDestroy,
} from '@angular/core';
import {
  DtFilterField,
  DtFilterFieldChangeEvent,
  DtFilterFieldDataSource,
} from '@dynatrace/barista-components/filter-field';
import { Action, switchDataSource, setFilters } from './state/actions';
import { quickFilterReducer } from './state/reducer';
import { getAutocompletes, getDataSource, getFilters } from './state/selectors';
import { createQuickFilterStore } from './state/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export class DtQuickFilter<T> implements AfterViewInit, OnDestroy {
  @Output() readonly filterChanges = new EventEmitter<
    DtFilterFieldChangeEvent<T>
  >();

  @ViewChild(DtFilterField, { static: true })
  private _filterField: DtFilterField<any>;

  /** The data source instance that should be connected to the filter field. */
  @Input()
  set dataSource(dataSource: DtFilterFieldDataSource) {
    this._store.dispatch(switchDataSource(dataSource));
  }

  private _store = createQuickFilterStore(quickFilterReducer);

  /** @internal the autocomplete fields that should be rendered by the quick filter */
  readonly _autocompleteData$ = this._store.select(getAutocompletes);
  /** @internal the dataSource that gets passed to the filter field */
  readonly _filterFieldDataSource$ = this._store.select(getDataSource);
  /** @internal the list of all current active filters */
  readonly _activeFilters$ = this._store.select(getFilters);

  private _destroy$ = new Subject<void>();

  ngAfterViewInit(): void {
    const initialFilers = [
      [
        {
          name: 'AUT',
          distinct: true,
          autocomplete: [
            { name: 'Linz' },
            { name: 'Vienna' },
            { name: 'Graz' },
          ],
        },
        { name: 'Graz' },
      ],
      [
        {
          name: 'Not in Quickfilter',
          autocomplete: [
            { name: 'Option1' },
            { name: 'Option2' },
            { name: 'Option3' },
          ],
        },
        { name: 'Option2' },
      ],
    ];

    this._store.dispatch(setFilters(initialFilers)); // this._filterField.filters

    // When the filters changes apply them to the filter field
    this._activeFilters$.pipe(takeUntil(this._destroy$)).subscribe(filters => {
      if (this._filterField.filters !== filters) {
        this._filterField.filters = filters;
      }
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  _changeFilter(action: Action): void {
    this._store.dispatch(action);
  }

  /** @internal Bubble the filter field change event through */
  _filterFiledChanged(change: DtFilterFieldChangeEvent<T>): void {
    this._store.dispatch(setFilters(change.filters));
    this.filterChanges.emit(change);
  }
}
