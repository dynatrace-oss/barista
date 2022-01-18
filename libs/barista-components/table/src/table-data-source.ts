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

import { DataSource } from '@angular/cdk/table';
import { compareValues, isNumber } from '@dynatrace/barista-components/core';
import { DtPagination } from '@dynatrace/barista-components/pagination';
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { DtTableSearch } from './search';
import {
  DtSimpleColumnComparatorFunction,
  DtSimpleColumnDisplayAccessorFunction,
  DtSimpleColumnSortAccessorFunction,
} from './simple-columns';
import { DtSort, DtSortEvent } from './sort/sort';
import { DtTableSelection } from './selection/selection';
import { DtTable } from './table';

export type DtSortAccessorFunction<T> = (data: T) => any; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Signature type for the comparision function, which can be passed to the DtTableDataSource.
 * The return value has to be < 0 if the left is logical smaller than right, 0 if they
 * are equivalent, otherwise > 0.
 */
export type DtColumnComparatorFunction<T> = (left: T, right: T) => number;

const DEFAULT_PAGE_SIZE = 10;
export class DtTableDataSource<T> extends DataSource<T> {
  /**
   * The filtered set of data that has been matched by the filter string, or all the data if there
   * is no filter. Useful for knowing the set of data the table represents.
   * For example, a 'selectAll()' function would likely want to select the set of filtered data
   * shown to the user rather than all the data.
   */
  filteredData: T[];

  /**
   * Data structure to expose exportable data to the table.
   */
  exporter: {
    filteredData: T[];
    selection: DtTableSelection<T> | null;
  } = {
    filteredData: [],
    selection: null,
  };

  /** @internal DisplayAccessorMap for SimpleColumn displayAccessor functions. */
  _displayAccessorMap: Map<string, DtSimpleColumnDisplayAccessorFunction<T>> =
    new Map();

  /**
   * @internal SortAccessorMap for SimpleColumn sortAccessor functions. This sortAccessorMap
   * is automatically populated by the sortAccessor functions on the dt-simple-columns.
   */
  _simpleColumnSortAccessorMap: Map<
    string,
    DtSimpleColumnSortAccessorFunction<T>
  > = new Map();

  /**
   * @internal
   * SortAccessorMap for SimpleColumn sortAccessor functions. This sortAccessorMap
   * is exposed to the outside and can be filled by the consumer.
   */
  _customSortAccessorMap: Map<string, DtSortAccessorFunction<T>> = new Map();

  /** Comparator map for SimpleColumn comparator functions */
  private _simpleComparatorMap: Map<
    string,
    DtSimpleColumnComparatorFunction<T>
  > = new Map();

  /** Comparator map for column comparator functions */
  private readonly _customComparatorMap: Map<
    string,
    DtColumnComparatorFunction<T>
  > = new Map();

  /** Stream that emits when a new data array is set on the data source. */
  private readonly _data: BehaviorSubject<T[]>;

  /** Stream emitting render data to the table (depends on ordered data changes). */
  private readonly _renderData = new BehaviorSubject<T[]>([]);

  /** Stream that emits when a new filter string is set on the data source. */
  private readonly _filter = new BehaviorSubject<string>('');

  /** Used to react to internal changes of the pagination that are made by the data source itself. */
  private readonly _internalPageChanges = new Subject<void>();

  /** Used for unsubscribing */
  private readonly _destroy$ = new Subject<void>();

  /**
   * Subscription to the changes that should trigger an update to the table's rendered rows, such
   * as filtering, sorting, pagination, or base data changes.
   */
  private _renderChangesSubscription = Subscription.EMPTY;
  private _searchChangeSubscription = Subscription.EMPTY;

  /** Public stream emitting render data to the table */
  renderData = this._renderData.asObservable();

  /** Array of data that should be rendered by the table, where each object represents one row. */
  get data(): T[] {
    return this._data.value;
  }
  set data(data: T[]) {
    this._data.next(data);
    this._updateChangeSubscription();
  }

  /**
   * Instance of the DtSort directive used by the table to control its sorting.
   * Sort changes emitted by the DtSort will trigger an update to the tables
   * rendered data.
   */
  get sort(): DtSort | null {
    return this._sort;
  }
  set sort(sort: DtSort | null) {
    this._sort = sort;
    this._updateChangeSubscription();
  }
  private _sort: DtSort | null;

  /**
   * Instance of the DtTableSelection directive used by the table to provide selected data.
   */
  get selection(): DtTableSelection<T> | null {
    return this.exporter.selection;
  }
  set selection(selection: DtTableSelection<T> | null) {
    this.exporter.selection = selection;
  }

  /**
   * Instance of the DtTableSearch directive used by the table to control which
   * rows are displayed. Search changes emitted by the DtTableSearch will
   * trigger an update to the tables rendered data.
   */
  get search(): DtTableSearch | null {
    return this._search;
  }

  set search(search: DtTableSearch | null) {
    this._search = search;

    this._searchChangeSubscription.unsubscribe();

    if (this._search !== null) {
      this._searchChangeSubscription = this._search._filterValueChanged
        .pipe(
          map((event) => event.value),
          distinctUntilChanged(),
        )
        .subscribe((value) => {
          this._filter.next(value);
        });
    } else {
      this._searchChangeSubscription = Subscription.EMPTY;
    }
  }
  private _search: DtTableSearch | null = null;

  /** Filter term that should be used to filter out objects from the data array. */
  get filter(): string {
    return this._filter.value;
  }
  set filter(value: string) {
    this._filter.next(value);
  }

  /**
   * Instance of the `DtPagination` component used by the table to control what page of the data is
   * displayed. Page changes emitted by the pagination will trigger an update to the
   * table's rendered data.
   *
   * Note that the data source uses the pagination's properties to calculate which page of data
   * should be displayed.
   */
  get pagination(): DtPagination | null {
    return this._pagination;
  }
  set pagination(pagination: DtPagination | null) {
    this._pagination = pagination;
    this._internalPageChanges.next();
    this._updateChangeSubscription();
  }
  private _pagination: DtPagination | null = null;

  /** Number of items to display on a page. By default set to 50. */
  get pageSize(): number {
    return this._pageSize;
  }
  set pageSize(pageSize: number) {
    this._pageSize = pageSize;

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!this._pagination) {
      this._pagination.pageSize = pageSize;
      this._internalPageChanges.next();
    }

    this._updateChangeSubscription();
  }
  private _pageSize: number = DEFAULT_PAGE_SIZE;

  /**
   * Data accessor function that is used for accessing data properties for sorting through
   * the default sortData function.
   * This default function assumes that the sort header IDs (which defaults to the column name)
   * matches the datas properties (e.g. column Xyz represents data['Xyz']).
   * May be set to a custom function for different behavior.
   */
  sortingDataAccessor: (
    data: T,
    sortHeaderId: string,
  ) => string | number | null = (
    data: T,
    sortHeaderId: string,
  ): string | number | null => {
    let value;
    if (this._customSortAccessorMap.has(sortHeaderId)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      value = this._customSortAccessorMap.get(sortHeaderId)!(data);
    } else if (this._simpleColumnSortAccessorMap.has(sortHeaderId)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      value = this._simpleColumnSortAccessorMap.get(sortHeaderId)!(
        data,
        sortHeaderId,
      );
    } else if (this._displayAccessorMap.has(sortHeaderId)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      value = this._displayAccessorMap.get(sortHeaderId)!(data, sortHeaderId);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value = (data as { [key: string]: any })[sortHeaderId];
    }

    if (isNumber(value)) {
      const numberValue = Number(value);

      // Numbers beyond `MAX_SAFE_INTEGER` can't be compared reliably so we
      // leave them as strings. For more info: https://goo.gl/y5vbSg
      return numberValue < Number.MAX_SAFE_INTEGER ? numberValue : value;
    }

    if (value === undefined) {
      return null;
    }

    return value;
  };

  /**
   * Gets a sorted copy of the data array based on the state of the DtSort. Called
   * after changes are made to the filtered data or when sort changes are emitted from DtSort.
   * By default, the function retrieves the active sort and its direction and compares data
   * by retrieving data using the sortingDataAccessor. May be overridden for a custom implementation
   * of data ordering.
   */
  sortData: (data: T[], sort: DtSort) => T[] = (
    data: T[],
    sort: DtSort,
  ): T[] => {
    const active = sort.active;
    const direction = sort.direction;
    if (!active || direction === '') {
      return data;
    }

    const comparator = this._getComparatorFunction(active);

    return data.sort(
      (a, b) => comparator(a, b) * (direction === 'asc' ? 1 : -1),
    );
  };

  /**
   * Checks if a data object matches the data source's filter string. By default, each data object
   * is converted to a string of its properties and returns true if the filter has
   * at least one occurrence in that string. By default, the filter string has its whitespace
   * trimmed and the match is case-insensitive. May be overridden for a custom implementation of
   * filter matching.
   *
   * @param data Data object used to check against the filter.
   * @param filter Filter string that has been set on the data source.
   * @returns Whether the filter matches against the data
   */
  filterPredicate: (data: T, filter: string) => boolean = (
    data: T,
    filter: string,
  ): boolean => {
    // Transform the data into a lowercase string of all property values.
    const dataStr = Object.keys(data)
      .reduce(
        (currentTerm: string, key: string) =>
          // Use an obscure Unicode character to delimit the words in the concatenated string.
          // This avoids matches where the values of two columns combined will match the user's query
          // (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
          // that has a very low chance of being typed in by somebody in a text field. This one in
          // particular is "White up-pointing triangle with dot" from
          // https://en.wikipedia.org/wiki/List_of_Unicode_characters
          // eslint-disable-next-line
          `${currentTerm}${(data as { [key: string]: any })[key]}◬`,
        '',
      )
      .toLowerCase();

    // Transform the filter by converting it to lowercase and removing whitespace.
    const transformedFilter = filter.trim().toLowerCase();

    return dataStr.indexOf(transformedFilter) !== -1;
  };

  constructor(initialData: T[] = []) {
    super();
    this._data = new BehaviorSubject<T[]>(initialData);
    this._updateChangeSubscription();
  }

  /**
   * Subscribe to changes that should trigger an update to the table's rendered rows. When the
   * changes occur, process the current state of the sort with the provided base data, and send
   * it to the table for rendering.
   */
  private _updateChangeSubscription(): void {
    const sortChange: Observable<DtSortEvent | null | boolean> = this._sort
      ? merge(this._sort.sortChange, this._sort._initialized)
      : of(null);

    const pageChange: Observable<boolean | number | null | void> = this
      ._pagination
      ? merge(
          this._pagination._initialized,
          this._internalPageChanges,
          this._pagination.changed,
        )
      : of(null);

    const dataStream = this._data;

    // Watch for base data or filter changes to provide a filtered set of data.
    const filteredData = combineLatest([dataStream, this._filter]).pipe(
      map(([data]) => this._filterData(data)),
    );

    // Watch for filtered data or sort changes to provide a sorted set of data.
    const sortedData = combineLatest([filteredData, sortChange]).pipe(
      map(([data]) => this._sortData(data)),
    );

    // Watch for ordered data or page changes to provide a paged set of data.
    const paginatedData = combineLatest([sortedData, pageChange]).pipe(
      map(([data]) => this._pageData(data)),
    );

    this._renderChangesSubscription.unsubscribe();
    this._renderChangesSubscription = paginatedData.subscribe((data) => {
      this._renderData.next(data);
    });
  }

  /**
   * @internal
   * Returns a sorted copy of the data if DtSort has a sort applied, otherwise just returns the
   * data array as provided. Uses the default data accessor for data lookup, unless a
   * sortDataAccessor function is defined.
   */
  _sortData(data: T[]): T[] {
    // If there is no active sort or direction, return the data without trying to sort.
    if (!this.sort) {
      return data;
    }

    return this.sortData(data.slice(), this.sort);
  }

  /**
   * Returns a filtered data array where each filter object contains the filter string within
   * the result of the filterTermAccessor function. If no filter is set, returns the data array
   * as provided.
   */
  private _filterData(data: T[]): T[] {
    // If there is a filter string, filter out data that does not contain it.
    // May be overridden for customization.
    this.filteredData = !this.filter
      ? data
      : data.filter((obj: T) => this.filterPredicate(obj, this.filter));

    if (
      this._pagination &&
      this._pagination.length !== this.filteredData.length
    ) {
      this._updatePagination(this.filteredData.length);
    }

    return this.filteredData;
  }

  /**
   * Returns a paged splice of the provided data array according to the provided pagination's page
   * index and length. If there is no pagination provided, return the data array as provided.
   */
  private _pageData(data: T[]): T[] {
    if (!this._pagination) {
      return data;
    }
    // -1 in case that the currentPage starts with 1
    const pageSize = this._pagination.pageSize;
    const startIndex = (this._pagination.currentPage - 1) * pageSize;
    return data.slice().splice(startIndex, pageSize);
  }

  /**
   * Updates the pagination to reflect the length of the filtered data, and makes sure that the page
   * index does not exceed the pagination's last page. Values are changed in a resolved promise to
   * guard against making property changes within a round of change detection.
   */
  private _updatePagination(filteredDataLength: number): void {
    Promise.resolve().then(() => {
      if (this._pagination) {
        const pagination = this._pagination;

        pagination.length = filteredDataLength;

        // If the page index is set beyond the page, reduce it to the last page.
        if (pagination.currentPage > 0) {
          // Set the last page index, if this would result to 0, fall back to the default
          // page 1.
          const lastPageIndex =
            Math.ceil(pagination.length / pagination.pageSize) || 1;
          const newPageIndex = Math.min(pagination.currentPage, lastPageIndex);

          if (newPageIndex !== pagination.currentPage) {
            pagination.currentPage = newPageIndex;

            // Since the pagination only emits after user-generated changes,
            // we need our own stream so we know to should re-render the data.
            this._internalPageChanges.next();
          }
        }
      }
    });
  }

  /**
   * Used by the DtTable. Called when it connects to the data source.
   */
  connect(_table: DtTable<T>): Observable<T[]> {
    _table._dataAccessors
      .pipe(takeUntil(this._destroy$))
      .subscribe(({ comparatorMap, displayAccessorMap, sortAccessorMap }) => {
        this._displayAccessorMap = displayAccessorMap;
        this._simpleColumnSortAccessorMap = sortAccessorMap;
        this._simpleComparatorMap = comparatorMap;
        this._updateChangeSubscription();
      });
    _table._filteredData = this.filteredData;
    _table._exporter = this.exporter;
    return this._renderData;
  }

  /**
   * Used by the DtTable. Called when it is destroyed. No-op.
   */
  disconnect(): void {
    this._renderChangesSubscription.unsubscribe();
    this._searchChangeSubscription.unsubscribe();

    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Lets the user define a sortAccessor function for a named column,
   * that is being used for sorting when the DataSource is used in combination
   * with simple and non-simple columns.
   */
  addSortAccessorFunction(
    columnName: string,
    fn: DtSortAccessorFunction<T>,
  ): void {
    this._customSortAccessorMap.set(columnName, fn);
    this._data.next(this._data.value);
  }

  /**
   * Lets the user remove a sortAccessor function for a named column,
   * that is being used for sorting when the DataSource is used in combination
   * with simple and non-simple columns.
   */
  removeSortAccessorFunction(columnName: string): void {
    this._customSortAccessorMap.delete(columnName);
  }

  /**
   * Lets the user define a comparator function for a named column,
   * that is being used for sorting when the DataSource is used in combination
   * with simple and non-simple columns.
   * A comparator defined with this function is used instead of a comparator
   * defined in a simple column.
   */
  addComparatorFunction(
    columnName: string,
    fn: DtColumnComparatorFunction<T>,
  ): void {
    this._customComparatorMap.set(columnName, fn);
    this._data.next(this._data.value);
  }

  /**
   * Lets the user remove a comparator function for a named column.
   */
  removeComparatorFunction(columnName: string): void {
    this._customComparatorMap.delete(columnName);
  }

  /**
   * Gets a comparator function which calls the responsible comparator function.
   * The comparator is first searched in the custom comparators, then in the simple
   * comparators, and if this does not exists, a fallback comparator is used.
   */
  private _getComparatorFunction(columnName: string): (a: T, b: T) => number {
    const customComparator = this._customComparatorMap.get(columnName);
    if (customComparator) {
      return customComparator;
    }

    const simpleComparator = this._simpleComparatorMap.get(columnName);
    if (simpleComparator) {
      return (a, b) => simpleComparator(a, b, columnName);
    }

    return (a, b) => this._fallbackColumnComparator(a, b, columnName);
  }

  /**
   * Default comparator so compare two rows.
   * If is used if no comparator is set in the SimpleColumns or custom defined one.
   */
  private _fallbackColumnComparator(left: T, right: T, active: string): number {
    const valueA = this.sortingDataAccessor(left, active);
    const valueB = this.sortingDataAccessor(right, active);

    return compareValues(valueA, valueB, 'asc');
  }
}
