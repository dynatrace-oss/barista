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

import { Observable, of, BehaviorSubject, Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { DtTable } from './table';
import {
  DtOrder,
  DtOrderChangeEvent,
  DtOrderReorderEvent,
} from './order/order-directive';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { DataSource } from '@angular/cdk/table';

export class DtTableOrderDataSource<T> extends DataSource<T> {
  /** Array of data that should be rendered by the table, where each object represents one row. */
  get data(): T[] {
    return this._data.value;
  }
  set data(data: T[]) {
    this._data.next(data);
    this._updateChangeSubscription();
  }
  /** Stream that emits when a new data array is set on the data source. */
  private readonly _data: BehaviorSubject<T[]>;

  /**
   * Instance of the DtOrder directive used by the table to control its order.
   * Order changes emitted by the DtOrder will trigger an update to the tables data.
   */
  get order(): DtOrder<T> | null {
    return this._order;
  }
  set order(order: DtOrder<T> | null) {
    this._order = order;
    this._updateChangeSubscription();
  }
  private _order: DtOrder<T> | null;

  /** Subscription to the changes that should trigger an update to the table's rendered rows */
  private _renderChangesSubscription = Subscription.EMPTY;

  constructor(initialData: T[] = []) {
    super();
    this._data = new BehaviorSubject<T[]>(initialData);
    this._updateChangeSubscription();
  }

  /**
   * Subscribe to changes that should trigger an update to the table's rendered rows. When the
   * changes occur, process the current state of the order with the provided data, and send
   * it to the table for rendering.
   */
  private _updateChangeSubscription(): void {
    const orderChange: Observable<DtOrderReorderEvent | null> = this._order
      ? this._order._reorder
      : of(null);

    const orderedData = orderChange.pipe(
      withLatestFrom(this._data),
      map(([reorderEvent, data]) => this._orderData(data, reorderEvent?.data)),
    );

    this._renderChangesSubscription.unsubscribe();
    this._renderChangesSubscription = orderedData.subscribe((data) => {
      this._data.next(data);
    });
  }

  /**
   * @internal
   * Returns a sorted copy of the data if DtSort has a sort applied, otherwise just returns the
   * data array as provided. Uses the default data accessor for data lookup, unless a
   * sortDataAccessor function is defined.
   */
  _orderData(data: T[], orderChange: DtOrderChangeEvent | undefined): T[] {
    // If there is no active order or direction, return the data without trying to sort.
    if (!this.order || !orderChange) {
      return data;
    }

    const clonedData = [...data];
    moveItemInArray(
      clonedData,
      orderChange.previousIndex,
      orderChange.currentIndex,
    );

    return clonedData;
  }

  /**
   * Used by the DtTable. Called when it connects to the data source.
   */
  connect(_table: DtTable<T>): Observable<T[]> {
    return this._data;
  }

  /**
   * Used by the DtTable. Called when it is destroyed. No-op.
   */
  disconnect(): void {
    this._renderChangesSubscription.unsubscribe();
  }
}
