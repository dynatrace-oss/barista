import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { CanDisable, isEmpty, mixinDisabled, DtSortDirection } from '@dynatrace/angular-components/core';
import { merge, Subscription } from 'rxjs';
import { DtColumnDef } from '../cell';
import { DtSort } from './sort';
import { getDtSortHeaderNotContainedWithinSortError } from './sort-errors';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

/**
 * Boilerplate for applying mixins to the sort header.
 * @internal
 */
export class DtSortHeaderBase {}
export const _DtSortHeaderMixinBase = mixinDisabled(DtSortHeaderBase);

/** @internal */
export type DtSortIconName = 'sorter-down' | 'sorter-up' | '';

/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 */
@Component({
  moduleId: module.id,
  selector: 'dt-header-cell[dt-sort-header]',
  exportAs: 'dtSortHeader',
  templateUrl: 'sort-header.html',
  styleUrls: ['sort-header.scss'],
  host: {
    '(click)': '_handleClick()',
    '[attr.aria-sort]': '_getAriaSortAttribute()',
    '[class.dt-sort-header-disabled]': '_isDisabled',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['disabled'],
})
export class DtSortHeader extends _DtSortHeaderMixinBase
    implements CanDisable, OnDestroy, OnInit {
  private _rerenderSubscription = Subscription.EMPTY;

  /**
   * The direction the arrow should be facing according to the current state.
   * @internal
   */
  _sortIconName: DtSortIconName = '';

  /**
   * Enables sorting on the dt-sort-header by applying the directive or not.
   */
  @Input('dt-sort-header')
  get sortable(): boolean { return this._sortable; }
  set sortable(value: boolean) {
    this._sortable = coerceBooleanProperty(value);
    if (this.sortable && !this._sort) {
      throw getDtSortHeaderNotContainedWithinSortError();
    }
  }
  private _sortable = true;

  /**
   * Overrides the sort start value of the containing DtSort
   * @internal
   */
  @Input() start: DtSortDirection;

  /** ID of this sort header. The name of the dtColumnDef is used as the id */
  private _id: string;

  /** Returns the internal id */
  get id(): string { return this._id; }

  /** Aria label for the sort header */
  @Input('sort-aria-label') ariaLabel: string;

  /**
   * Wether the entire table sorting is disabled or the column is disabled
   * @internal
   */
  get _isDisabled(): boolean {
    return (this._sort && this._sort.disabled) || this.disabled;
  }

  /**
   * Whether this DtSortHeader is currently sorted in either ascending or descending order.
   * @internal
   */
  get _isSorted(): boolean {
    const sorted = this._sortable && this._sort.active === this._id &&
    (this._sort.direction === 'asc' || this._sort.direction === 'desc');
    return sorted;
  }

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _dtColumnDef: DtColumnDef,
    @Optional() private _sort: DtSort) {

    super();
    if (_sort) {
      this._rerenderSubscription =
        merge(_sort.sortChange, _sort._stateChanges)
          .subscribe(() => {
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
    // When a sorted header is being destroyed at runtime, we need to update the dtSort
    // to unset the current sorting state.
    if (this._sort) {
      this._sort._unregister(this);
    }
    this._rerenderSubscription.unsubscribe();
  }

  /** Updates the icon used for the sorter */
  private _updateSorterIcon(): void {
    const sorting = this._isSorted ?
        this._sort.direction || this.start : '';
    this._sortIconName = isEmpty(sorting) ? this._sortIconName = '' : sorting === 'asc' ? 'sorter-up' : 'sorter-down';
  }

  /**
   * Triggers the sort on this sort header
   * @internal
   */
  _handleClick(): void {
    if (this._isDisabled || !this._sortable) { return; }
    this._sort.sort(this);
  }

  /**
   * Gets the aria-sort attribute that should be applied to this sort header. If this header
   * is not sorted, returns null so that the attribute is removed from the host element. Aria spec
   * says that the aria-sort property should only be present on one header at a time, so removing
   * ensures this is true.
   * @internal
   */
  _getAriaSortAttribute(): string | null {
    if (!this._isSorted) { return null; }

    return this._sort.direction === 'asc' ? 'ascending' : 'descending';
  }
}
