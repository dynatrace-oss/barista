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
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  DtFilterField,
  DtFilterFieldChangeEvent,
} from '@dynatrace/barista-components/filter-field';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DtQuickFilterDataSource } from './quick-filter-data-source';
import { Action, setFilters, switchDataSource } from './state/actions';
import { quickFilterReducer } from './state/reducer';
import { getAutocompletes, getDataSource, getFilters } from './state/selectors';
import { createQuickFilterStore, QuickFilterState } from './state/store';

/** Directive that is used to place a title inside the quick filters sidebar */
@Directive({
  selector: 'dt-quick-filter-title',
  exportAs: 'dtQuickFilterTitle',
  host: {
    class: 'dt-quick-filter-title',
  },
})
export class DtQuickFilterTitle {}

/** Directive that is used to place a subtitle inside the quick filters sidebar */
@Directive({
  selector: 'dt-quick-filter-sub-title',
  exportAs: 'dtQuickFilterSubTitle',
  host: {
    class: 'dt-quick-filter-sub-title',
  },
})
export class DtQuickFilterSubTitle {}

/**
 * The `DtQuickFilterChangeEvent` is a class that is used to transport data.
 * It contains the added and removed filters as the current set of all filters.
 */
export class DtQuickFilterChangeEvent<T> extends DtFilterFieldChangeEvent<T> {}

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
export class DtQuickFilter<T = any> implements AfterViewInit, OnDestroy {
  /** Emits when a new filter has been added or removed. */
  @Output() readonly filterChanges = new EventEmitter<
    DtQuickFilterChangeEvent<T>
  >();

  /**
   * @internal
   * Instance of the filter field that will be controlled by the quick filter
   */
  @ViewChild(DtFilterField, { static: true })
  _filterField: DtFilterField<T>;

  /**
   * Label for the filter field (e.g. "Filter by").
   * Will be placed next to the filter icon in the filter field
   */
  @Input() label = '';

  /** Label for the "Clear all" button in the filter field (e.g. "Clear all"). */
  @Input() clearAllLabel = '';

  /** Set the Aria-Label attribute */
  @Input('aria-label') ariaLabel = '';

  /** The data source instance that should be connected to the filter field. */
  @Input()
  get dataSource(): DtQuickFilterDataSource {
    const dataSource = this._store.select(
      (state: BehaviorSubject<QuickFilterState>) => state.value.dataSource,
    )!;
    return dataSource;
  }
  set dataSource(dataSource: DtQuickFilterDataSource) {
    this._store.dispatch(switchDataSource(dataSource));
  }

  /** The currently applied filters */
  @Input()
  get filters(): T[][] {
    return this._filterField.filters;
  }
  set filters(filters: T[][]) {
    this._store.dispatch(setFilters(filters));
  }

  /**
   * The aria-level of the group headlines for the document outline.
   */
  @Input() groupHeadlineRole: number = 3;

  /** The store where the data flow is managed */
  private _store = createQuickFilterStore(quickFilterReducer);

  /** @internal the autocomplete fields that should be rendered by the quick filter */
  readonly _autocompleteData$ = this._store.select(getAutocompletes);
  /** @internal the dataSource that gets passed to the filter field */
  readonly _filterFieldDataSource$ = this._store.select(getDataSource);
  /** @internal the list of all current active filters */
  readonly _activeFilters$ = this._store.select(getFilters);

  /** Subject that is used for bulk unsubscribing */
  private _destroy$ = new Subject<void>();

  /** Angular life-cycle hook that will be called after the view is initialized */
  ngAfterViewInit(): void {
    // When the filters changes apply them to the filter field
    this._activeFilters$
      .pipe(takeUntil(this._destroy$))
      .subscribe((filters) => {
        if (this._filterField.filters !== filters) {
          this._filterField.filters = filters;
        }
      });
  }

  /** Angular life-cycle hook that will be called on component destroy */
  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * @internal
   * When the user selects an option in the quick filter an action gets passed
   * to this function that will be dispatched to the store
   */
  _changeFilter(action: Action): void {
    this._store.dispatch(action);
    this.filterChanges.emit(
      new DtQuickFilterChangeEvent(
        this._filterField,
        [],
        [],
        this._filterField.filters,
      ),
    );
  }

  /** @internal Bubble the filter field change event through */
  _filterFiledChanged(change: DtFilterFieldChangeEvent<T>): void {
    this._store.dispatch(setFilters(change.filters));
    this.filterChanges.emit(change);
  }
}
