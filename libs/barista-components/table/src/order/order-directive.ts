/**
 * @license
 * Copyright 2021 Dynatrace LLC
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
  Directive,
  Output,
  Host,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CanDisable, mixinDisabled } from '@dynatrace/barista-components/core';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { BehaviorSubject, Subscription, Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DtTable } from '../table';
import { DtTableDataSource } from '../table-data-source';

/**
 * Event emitted when the order input field of a row changes
 * and loses focus or the enter key is released
 */
export interface DtOrderChangeEvent {
  /** The previous index of the row whose order changed */
  previousIndex: number;

  /** The index the row's order was changed to */
  currentIndex: number;
}

export interface DtOrderReorderEvent {
  /** Order change event emitted by the order cell */
  data: DtOrderChangeEvent;

  /** Flag to determine whether the event was triggered by the user */
  userTriggered: boolean;
}

/**
 * Boilerplate for applying mixins to DtOrder.
 *
 * @internal
 */
export class DtOrderBase {}
export const _DtOrderMixinBase = mixinDisabled(DtOrderBase);

/** Container for DtOrderCells to manage the order index. */
@Directive({
  selector: '[dtOrder]',
  exportAs: 'dtOrder',
  inputs: ['disabled: dtOrderDisabled'],
  host: {
    '[class.dt-order-disabled]': 'disabled',
  },
})
export class DtOrder<T>
  extends _DtOrderMixinBase
  implements CanDisable, AfterViewInit, OnChanges, OnDestroy
{
  /**
   * @internal Event that is emitted whenever the input value of the order column
   * changes due to user input or dragging an item to a new position.
   */
  readonly _reorder = new Subject<DtOrderReorderEvent>();

  /**
   * Event that is emitted whenever the input value of the order column
   * changes due to user input or dragging an item to a new position.
   */
  @Output('dtOrderChange')
  readonly orderChange: Observable<DtOrderChangeEvent> = this._reorder.pipe(
    filter((event) => !event.userTriggered),
    map((event) => event.data),
  );

  /**
   * @internal Emits when the disabled input changes
   * Used in order cell to enable/disable the input field
   */
  _disabledChange = new BehaviorSubject<boolean>(false);

  /** Subscription of the drop list dropped event emitter */
  private _dropListSubscription: Subscription = Subscription.EMPTY;

  constructor(
    @Host() readonly _dropList: CdkDropList<T[]>,
    @Host() readonly _table: DtTable<T>,
  ) {
    super();
  }

  /**
   * Subscribes to the cdk drop list dropped event and calls
   * the order function to emit an order change event
   */
  ngAfterViewInit(): void {
    this._dropListSubscription = this._dropList.dropped.subscribe(
      ($event: CdkDragDrop<T[]>) => {
        this._order($event.previousIndex, $event.currentIndex);
      },
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disabled) {
      this._disabledChange.next(changes.disabled.currentValue);
      this._dropList.disabled = changes.disabled.currentValue;
    }
  }

  ngOnDestroy(): void {
    this._dropListSubscription.unsubscribe();
  }

  /** Order function exposed to the user to trigger a reorder programatically */
  order(currentIndex: number, targetIndex: number): void {
    this._order(currentIndex, targetIndex, true);
  }

  /** @internal Emits an order change event to trigger a reorder of the data source. */
  _order(
    previousIndex: number,
    currentIndex: number,
    userTriggered: boolean = false,
  ): void {
    if (this.disabled || !this._dropList?.data) {
      return;
    }

    // Get number of rows to correctly set the current index if it exceeds the number of rows
    const numRows =
      (this._table.dataSource as DtTableDataSource<T>).data.length - 1;

    // Emits reorder event to trigger reorder of the datasource
    this._reorder.next({
      data: {
        previousIndex,
        currentIndex: currentIndex > numRows ? numRows : currentIndex,
      },
      userTriggered,
    });
  }
}
