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

import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription, merge } from 'rxjs';

import {
  CanDisable,
  DtSortDirection,
  mixinDisabled,
} from '@dynatrace/barista-components/core';

import { DtColumnDef } from '../cell';
import { DtSort } from './sort';
import { getDtSortHeaderNotContainedWithinSortError } from './sort-errors';

/**
 * Boilerplate for applying mixins to the sort header.
 *
 * @internal
 */
export class DtSortHeaderBase {}
export const _DtSortHeaderMixinBase = mixinDisabled(DtSortHeaderBase);

/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 */
@Component({
  selector: 'dt-header-cell[dt-sort-header]',
  exportAs: 'dtSortHeader',
  templateUrl: 'sort-header.html',
  styleUrls: ['sort-header.scss'],
  host: {
    '(click)': '_handleClick()',
    '[attr.aria-sort]': '_getAriaSortAttribute()',
    '[class.dt-sort-header-disabled]': '_isDisabled',
    '[class.dt-sortable]': 'sortable && !_isDisabled',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['disabled'],
})
export class DtSortHeader
  extends _DtSortHeaderMixinBase
  implements CanDisable, OnDestroy, OnInit
{
  static ngAcceptInputType_disabled: BooleanInput;

  private _rerenderSubscription = Subscription.EMPTY;

  /**
   * The direction the arrow should be facing according to the current state.
   *
   * @internal
   */
  _sortIconName: 'sorter2-down' | 'sorter2-up' | 'sorter-double' =
    'sorter-double';

  /**
   * Enables sorting on the dt-sort-header by applying the directive or not.
   */
  @Input('dt-sort-header')
  get sortable(): boolean {
    return this._sortable;
  }
  set sortable(value: boolean) {
    this._sortable = coerceBooleanProperty(value);
    if (this.sortable && !this._sort) {
      throw getDtSortHeaderNotContainedWithinSortError();
    }
  }
  private _sortable = true;
  static ngAcceptInputType_sortable: BooleanInput;

  /**
   * Overrides the sort start value of the containing DtSort
   */
  @Input() start: DtSortDirection;

  /** ID of this sort header. The name of the dtColumnDef is used as the id */
  private _id: string;

  /** Returns the internal id */
  get id(): string {
    return this._id;
  }

  /** Aria label for the sort header */
  @Input('sort-aria-label') ariaLabel: string;

  /**
   * Wether the entire table sorting is disabled or the column is disabled
   *
   * @internal
   */
  get _isDisabled(): boolean {
    return (this._sort && this._sort.disabled) || this.disabled;
  }

  /**
   * Whether this DtSortHeader is currently sorted in either ascending or descending order.
   *
   * @internal
   */
  get _isSorted(): boolean {
    const sorted =
      this._sortable &&
      this._sort.active === this._id &&
      (this._sort.direction === 'asc' || this._sort.direction === 'desc');
    return sorted;
  }

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _dtColumnDef: DtColumnDef,
    @Optional() private _sort: DtSort,
  ) {
    super();
    if (_sort) {
      this._rerenderSubscription = merge(
        _sort.sortChange,
        _sort._stateChanges,
      ).subscribe(() => {
        this._updateSorterIcon();
        this._changeDetectorRef.markForCheck();
      });
    }
  }

  ngOnInit(): void {
    this._id = this._dtColumnDef.name;
    this._updateSorterIcon();
  }

  ngOnDestroy(): void {
    this._rerenderSubscription.unsubscribe();
  }

  /** Updates the icon used for the sorter */
  private _updateSorterIcon(): void {
    this._sortIconName = this._isSorted
      ? this._sort.direction === 'asc'
        ? 'sorter2-up'
        : 'sorter2-down'
      : 'sorter-double';
  }

  /**
   * Triggers the sort on this sort header
   *
   * @internal
   */
  _handleClick(): void {
    if (this._isDisabled || !this._sortable) {
      return;
    }
    this._sort.sort(this);
  }

  /**
   * Gets the aria-sort attribute that should be applied to this sort header. If this header
   * is not sorted, returns null so that the attribute is removed from the host element. Aria spec
   * says that the aria-sort property should only be present on one header at a time, so removing
   * ensures this is true.
   *
   * @internal
   */
  _getAriaSortAttribute(): string | null {
    if (!this._isSorted) {
      return null;
    }

    return this._sort.direction === 'asc' ? 'ascending' : 'descending';
  }
}
