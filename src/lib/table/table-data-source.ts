import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, merge, of, combineLatest, Subscription, Subject } from 'rxjs';
import { DtSort, DtSortEvent } from './sort/sort';
import { map, takeUntil } from 'rxjs/operators';
import { isNumber, isString } from '@dynatrace/angular-components/core';
import {compareString } from './sort/sort-helpers';
import { DtTable } from './table';
import { DtSimpleColumnDisplayAccessorFunction, DtSimpleColumnSortAccessorFunction } from './simple-columns/simple-column-base';

export class DtTableDataSource<T> extends DataSource<T> {
  /** Stream that emits when a new data array is set on the data source. */
  private readonly _data: BehaviorSubject<T[]>;

  /** Stream emitting render data to the table (depends on ordered data changes). */
  private readonly _renderData = new BehaviorSubject<T[]>([]);

  private readonly _destroy = new Subject<void>();

  /**
   * Subscription to the changes that should trigger an update to the table's rendered rows, such
   * as filtering, sorting, pagination, or base data changes.
   */
  _renderChangesSubscription = Subscription.EMPTY;

  /** Array of data that should be rendered by the table, where each object represents one row. */
  get data(): T[] {
    return this._data.value;
  }
  set data(data: T[]) {
    this._data.next(data);
  }

  /**
   * Instance of the DtSort directive used by the table to control its sorting. Sort changes
   * emitted by the DtSort will trigger an update to the tables's rendered data.
   */
  private _sort: DtSort | null;
  get sort(): DtSort | null {
    return this._sort;
  }
  set sort(sort: DtSort|null) {
    this._sort = sort;
    this._updateChangeSubscription();
  }

  /** @internal DisplayAccessorMap for SimpleColumn displayAccessor functions. */
  _displayAccessorMap: Map<string, DtSimpleColumnDisplayAccessorFunction<T>> = new Map();

  /** @internal SortAccessorMap for SimpleColumn sortAccessor functions. */
  _sortAccessorMap: Map<string, DtSimpleColumnSortAccessorFunction<T>> = new Map();

  /**
   * Data accessor function that is used for accessing data properties for sorting through
   * the default sortData function.
   * This default function assumes that the sort header IDs (which defaults to the column name)
   * matches the data's properties (e.g. column Xyz represents data['Xyz']).
   * May be set to a custom function for different behavior.
   */
  sortingDataAccessor: ((data: T, sortHeaderId: string) => string|number|null) =
    (data: T, sortHeaderId: string): string|number|null => {

    let value;
    if (this._sortAccessorMap.has(sortHeaderId)) {
      value = this._sortAccessorMap.get(sortHeaderId)!(data, sortHeaderId);
    } else if (this._displayAccessorMap.has(sortHeaderId)) {
      value = this._displayAccessorMap.get(sortHeaderId)!(data, sortHeaderId);
    } else {
      // tslint:disable-next-line: no-any
      value = (data as {[key: string]: any})[sortHeaderId];
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
  }

  /**
   * Gets a sorted copy of the data array based on the state of the DtSort. Called
   * after changes are made to the filtered data or when sort changes are emitted from DtSort.
   * By default, the function retrieves the active sort and its direction and compares data
   * by retrieving data using the sortingDataAccessor. May be overridden for a custom implementation
   * of data ordering.
   */
  sortData: ((data: T[], sort: DtSort) => T[]) = (data: T[], sort: DtSort): T[] => {
    const active = sort.active;
    const direction = sort.direction;
    if (!active || direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const valueA = this.sortingDataAccessor(a, active);
      const valueB = this.sortingDataAccessor(b, active);

      // If both valueA and valueB exist (truthy), then compare the two. Otherwise, check if
      // one value exists while the other doesn't. In this case, existing value should come first.
      // This avoids inconsistent results when comparing values to undefined/null.
      // If neither value exists, return 0 (equal).
      let comparatorResult = 0;
      if (valueA !== null && valueB !== null) {
        if (isString(valueA) && isString(valueB)) {
          comparatorResult = compareString((valueA as string), (valueB as string));
        } else {
          // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
          if (valueA > valueB) {
            comparatorResult = 1;
          } else if (valueA < valueB) {
            comparatorResult = -1;
          }
        }
      } else if (valueA !== null) {
        comparatorResult = -1;
      } else if (valueB !== null) {
        comparatorResult = 1;
      }

      return comparatorResult * (direction === 'asc' ? 1 : -1);
    });
  }

  constructor(initialData: T[] = []) {
    super();
    this._data = new BehaviorSubject<T[]>(initialData);
    this._updateChangeSubscription();
  }

  /**
   * Subscirbe to changes that should trigger an update to the table's rendered rows. When the
   * changes occur, process the current state of the sort with the provided base data, and send
   * it to the table for rendering.
   */
  private _updateChangeSubscription(): void {
    const sortChange: Observable<DtSortEvent|null|boolean> = this._sort ?
      merge(this._sort.sortChange, this._sort._initialized) as Observable<DtSort|boolean> :
      of(null);

    const dataStream = this._data;
    const sortedData = combineLatest(dataStream, sortChange)
      .pipe(map(([data]) => this._sortData(data)));

    this._renderChangesSubscription.unsubscribe();
    this._renderChangesSubscription = sortedData.subscribe((data) => {
      this._renderData.next(data);
    });
  }

  /**
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
   * Used by the DtTable. Called when it connects to the data source.
   */
  connect(_table: DtTable<T>): Observable<T[]> {
    _table._dataAccessors
      .pipe(takeUntil(this._destroy))
      .subscribe(({ displayAccessorMap, sortAccessorMap }) => {
        this._displayAccessorMap = displayAccessorMap;
        this._sortAccessorMap = sortAccessorMap;
        this._updateChangeSubscription();
      });
    return this._renderData;
  }

  /**
   * Used by the DtTable. Called when it is destroyed. No-op.
   */
  disconnect(): void {
    this._destroy.next();
    this._destroy.complete();
  }
}
