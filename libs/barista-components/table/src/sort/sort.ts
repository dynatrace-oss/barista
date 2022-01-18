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
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  isDevMode,
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import {
  CanDisable,
  DtSortDirection,
  isDefined,
  mixinDisabled,
} from '@dynatrace/barista-components/core';

import { getDtSortInvalidDirectionError } from './sort-errors';
import { DtSortHeader } from './sort-header';

/** The current sort state. */
export interface DtSortEvent {
  /** The id of the column being sorted. */
  active: string;

  /** The sort direction. */
  direction: DtSortDirection;
}

/**
 * Boilerplate for applying mixins to DtSort.
 *
 * @internal
 */
export class DtSortBase {}
export const _DtSortMixinBase = mixinDisabled(DtSortBase);

/** Container for DtSortHeaders to manage the sort state and provide default sort parameters. */
@Directive({
  selector: '[dtSort]',
  exportAs: 'dtSort',
  inputs: ['disabled: dtSortDisabled'],
})
export class DtSort
  extends _DtSortMixinBase
  implements CanDisable, OnChanges, OnInit, OnDestroy
{
  /**
   * Used to notify any child components listening to state changes.
   *
   * @internal
   */
  readonly _stateChanges = new Subject<void>();

  /** @internal Initialized subject that fires on initialization and completes on destroy. */
  readonly _initialized = new BehaviorSubject<boolean>(false);

  /** The id of the most recently sorted DtSortHeader. */
  @Input('dtSortActive') active: string;

  /**
   * The direction to set when an DtSortHeader is initially sorted.
   * May be overriden by the DtSortHeader's sort start.
   */
  @Input('dtSortStart') start: DtSortDirection = 'asc';

  /** The sort direction of the currently active DtSortHeader. */
  @Input('dtSortDirection')
  get direction(): DtSortDirection {
    return this._direction;
  }
  set direction(direction: DtSortDirection) {
    if (
      isDevMode() &&
      direction &&
      direction !== 'asc' &&
      direction !== 'desc'
    ) {
      throw getDtSortInvalidDirectionError(direction);
    }
    this._direction = direction;
  }
  private _direction: DtSortDirection = '';

  /** Event emitted when the user changes either the active sort or sort direction. */
  @Output('dtSortChange')
  readonly sortChange: EventEmitter<DtSortEvent> = new EventEmitter<DtSortEvent>();

  /** Sets the active sort id and determines the new sort direction. */
  sort(sortable: DtSortHeader): void;
  /** Sets the active sort id and sets the sort direction */
  sort(active: string, direction: DtSortDirection): void;
  /** Sets the active sort id and determines the new sort direction. */
  sort(
    sortableOrActive: string | DtSortHeader,
    direction?: DtSortDirection,
  ): void {
    if (typeof sortableOrActive === 'string') {
      this.active = sortableOrActive;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.direction = direction!;
    } else {
      const sortable = sortableOrActive;
      if (this.active !== sortable.id) {
        this.active = sortable.id;
        this.direction = sortable.start ? sortable.start : this.start;
      } else {
        this.direction = this.getNextSortDirection(sortable);
      }
    }

    this.sortChange.emit({ active: this.active, direction: this.direction });
  }

  /** Returns the next sort direction of the active sortable. */
  getNextSortDirection(sortable: DtSortHeader): DtSortDirection {
    if (!sortable) {
      return '';
    }
    const sortDirectionCycle = getSortDirection(sortable.start || this.start);

    // Get and return the next direction in the cycle
    let nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
    if (nextDirectionIndex >= sortDirectionCycle.length) {
      nextDirectionIndex = 0;
    }
    return sortDirectionCycle[nextDirectionIndex];
  }

  ngOnInit(): void {
    this._initialized.next(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If the active column is set initially but the target direction is not defined
    // we need to default the sort direction to the start direction.
    if (
      isDefined(changes.active) &&
      changes.active.firstChange &&
      this.direction === ''
    ) {
      this.direction = this.start;
    }

    // If active is bound and being changed after initialization
    // we need to update the sorter. We also need to initially sort
    // the active column if a direction has been provided.
    if (isDefined(changes.active) && this.active && this.direction) {
      this.sort(this.active, this.direction);
    }

    this._stateChanges.next();
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();
    this._initialized.complete();
  }
}

/** Returns the sort direction cycle to use given the provided parameters of order and clear. */
function getSortDirection(start: DtSortDirection): DtSortDirection[] {
  const sortOrder: DtSortDirection[] = ['asc', 'desc'];
  if (start === 'desc') {
    sortOrder.reverse();
  }
  return sortOrder;
}
