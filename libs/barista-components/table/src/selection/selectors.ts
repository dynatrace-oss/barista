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

import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { DtCheckboxChange } from '@dynatrace/barista-components/checkbox';
import { DtTable } from '../table';
import { DtTableSelection } from './selection';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DtTableDataSource } from '../table-data-source';

/** Handles row selection in combination with the DtTableSelection directive on the table */
@Component({
  selector: 'dt-table-row-selector',
  template: ` <dt-cell class="dt-selectable-cell">
    <dt-checkbox
      [disabled]="_disabled(row) || _disabledDueToLimit"
      [value]="row"
      [checked]="_isSelected"
      (change)="_toggleRow($event)"
      [aria-label]="ariaLabel"
    ></dt-checkbox>
  </dt-cell>`,
  styleUrls: ['./selectors.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtTableRowSelector<T> implements OnDestroy {
  /** The rows data used for selection */
  @Input() row: T;

  /** Aria label of the row selector checkbox. */
  @Input('aria-label') ariaLabel: string;

  /**
   * @internal Whether the checkbox should be disabled due to the selectionLimit
   * Whether the checkbox is disabled is determined based on whether the predicate is true or
   * the limit is reached and the row is currently not selected.
   */
  get _disabledDueToLimit(): boolean {
    return this._selector.selectionLimitReached && !this._isSelected;
  }

  /** @internal Whether the row is currently selected */
  get _isSelected(): boolean {
    return this._selector.isSelected(this.row);
  }

  /** Subscription for selectionChanges stored for cleanup */
  private _selectionChangedSubscription = Subscription.EMPTY;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _selector: DtTableSelection<T>,
  ) {
    this._selectionChangedSubscription =
      this._selector.selectionChange.subscribe(() => {
        this._changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this._selectionChangedSubscription.unsubscribe();
  }

  /** @internal Callback when the row is toggled by interacting with the checkbox */
  _toggleRow(changeEvent: DtCheckboxChange<T>): void {
    if (changeEvent.checked) {
      this._selector.select(this.row);
    } else {
      this._selector.deselect(this.row);
    }
  }

  _disabled(row: T): boolean {
    return this._selector.disabled(row);
  }
}

/** Provides a master toggle selection in the table's header in combination with the DtTableSelection directive */
@Component({
  selector: 'dt-table-header-selector',
  template: `
    <dt-header-cell class="dt-selectable-cell">
      <dt-checkbox
        [className]="
          _table._hasExpandableRows
            ? 'dt-selectable-header-for-expandable-rows'
            : 'dt-selectable-header'
        "
        [disabled]="_isTableEmpty"
        (change)="_toggleAllSelection($event)"
        [checked]="_isAllSelected"
        [indeterminate]="_isAnySelected"
        [aria-label]="ariaLabel"
      ></dt-checkbox>
    </dt-header-cell>
  `,
  styleUrls: ['./selectors.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtTableHeaderSelector<T> implements OnDestroy {
  /** Aria label of the header selector checkbox. */
  @Input('aria-label') ariaLabel: string;

  /** @internal Whether all rows are currently selected */
  get _isAllSelected(): boolean {
    // If there are no rows in the snapshot, this needs to be always false
    if (this._table._dataSnapshot.length === 0) {
      return false;
    }
    const allRowsSelected = this._table._dataSnapshot
      .filter((row) => !this._selector.disabled(row))
      .every((row) => this._selector.isSelected(row));
    return this._selector.selectionLimitReached || allRowsSelected;
  }

  /** @internal Whether any rows are currently selected - this sets the master checkbox to indeterminate */
  get _isAnySelected(): boolean {
    return this._selector.selected.length > 0 && !this._isAllSelected;
  }

  /** @internal Determines wheter or not the table dataset is empty */
  get _isTableEmpty(): boolean {
    return this._table._dataSnapshot.length === 0;
  }
  /** Subscription for selectionChanges stored for cleanup */
  private readonly _destroy$ = new Subject<void>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _selector: DtTableSelection<T>,
    readonly _table: DtTable<T>,
  ) {
    if (this._table.dataSource instanceof DtTableDataSource) {
      this._table.dataSource.renderData
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => this._changeDetectorRef.markForCheck());
    }
    this._selector.selectionChange
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this._changeDetectorRef.markForCheck());
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** @internal Callback when the master checkbox is interacted with */
  _toggleAllSelection(changeEvent: DtCheckboxChange<T>): void {
    const data = this._getRowsToSelect();
    if (changeEvent.checked) {
      this._selector.select(...data);
    } else {
      if (this._table.dataSource instanceof DtTableDataSource) {
        const source: DtTableDataSource<T> = this._table.dataSource;
        this._selector.deselect(...source.filteredData);
      } else {
        this._selector.clear();
      }
    }
  }

  private _getRowsToSelect(): T[] {
    const data = this._table._dataSnapshot;
    const selectionSize =
      (this._selector._config?.selectionLimit ?? data.length) -
      this._selector.selected.length;
    return this._table._dataSnapshot
      .filter(
        (row) =>
          !this._selector.disabled(row) &&
          !this._selector.selected.includes(row),
      )
      .slice(0, selectionSize)
      .concat(this._selector.selected);
  }
}
