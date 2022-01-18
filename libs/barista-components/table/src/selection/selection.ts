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

import { SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import {
  Directive,
  Output,
  InjectionToken,
  Inject,
  Optional,
  Input,
  ChangeDetectorRef,
  OnInit,
  Predicate,
} from '@angular/core';
import { isNumber } from '@dynatrace/barista-components/core';

/** The config provided to the DtTableSelection */
export interface DtTableSelectionConfig {
  /**
   * This limits the number of rows that can be selected at once.
   * By default there is no limit
   */
  selectionLimit?: number;
}

/** Injectiontoken used to the DtTableSelection configuration */
export const DT_TABLE_SELECTION_CONFIG =
  new InjectionToken<DtTableSelectionConfig>('DT_TABLE_SELECTION_CONFIG');

/**
 * Directive for managing selection on a DtTable component
 * use in combination with dt-table-row-selector and dt-table-header-selector components
 */
@Directive({
  selector: '[dtTableSelection]',
  exportAs: 'dtTableSelection',
  host: {
    class: 'dt-table-selection',
  },
})
export class DtTableSelection<T> implements OnInit {
  /** The selection model used for handling selection states */
  private _selectionModel = new SelectionModel<T>(true);

  /** Whether the component is already initialized */
  private _initialized = false;

  /**
   * Fires an event when the selection of the DtSelectableColumn changes
   * The event contains rows that were added and removed from the selection
   */
  @Output('dtTableSelectionChange')
  readonly selectionChange: Observable<SelectionChange<T>> =
    this._selectionModel.changed.asObservable();

  /**
   * The rows that should be selected initially
   *
   * Note that the items passed to this input are checked with object equality
   * with the data passed to the dataSource input on the table
   */
  @Input('dtTableSelectionInitial')
  get selected(): T[] {
    return this._selectionModel.selected;
  }
  set selected(val: T[]) {
    if (Array.isArray(val) && !this._initialized) {
      this.select(...val);
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   * Whether a table row should be selectable or not
   */
  @Input('dtTableIsRowDisabled')
  disabled: Predicate<T> = () => false;

  /** Whether the selection limit is currently reached */
  get selectionLimitReached(): boolean {
    return (
      isNumber(this._config?.selectionLimit) &&
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._config!.selectionLimit <= this._selectionModel.selected.length
    );
  }

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional()
    @Inject(DT_TABLE_SELECTION_CONFIG)
    readonly _config?: DtTableSelectionConfig,
  ) {}

  ngOnInit(): void {
    this._initialized = true;
  }

  /**
   * Selects a row or an array of rows. Does not consider the selectionLimit configured.
   */
  select(...row: T[]): void {
    this._selectionModel.select(...row);
  }
  /**
   * Deselects a row or an array of rows.
   */
  deselect(...row: T[]): void {
    this._selectionModel.deselect(...row);
  }
  /**
   * Toggles a row between selected and deselected. Does not consider the selectionLimit configured.
   */
  toggle(row: T): void {
    this._selectionModel.toggle(row);
  }

  /** Clears the selection */
  clear(): void {
    this._selectionModel.clear();
  }
  /** Whether a given row is currently selected */
  isSelected(row: T): boolean {
    return this._selectionModel.isSelected(row);
  }
}
