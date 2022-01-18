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
  coerceBooleanProperty,
  BooleanInput,
  NumberInput,
  coerceNumberProperty,
} from '@angular/cdk/coercion';
import {
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DtIndicatorThemePalette } from '@dynatrace/barista-components/indicator';
import { DtFormattedValue } from '@dynatrace/barista-components/formatters';
import { DtCellDef, DtColumnDef } from '../cell';
import { DtHeaderCellDef } from '../header/header-cell';
import { DtTable } from '../table';

/** Signature type for the dataAccessor function which can be passed to the simpleColumn. */
export type DtSimpleColumnDisplayAccessorFunction<T> = (
  data: T,
  name: string,
) => any; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Signature type for the sortAccessor function which can be passed to the simpleColumn. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DtSimpleColumnSortAccessorFunction<T> = (
  data: T,
  name: string,
) => string | number;

/** Signature type for the hasProblem function, which can be passed to the simpleColumn. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DtSimpleColumnHasProblemFunction<T> = (
  data: T,
  name: string,
) => DtIndicatorThemePalette;

/**
 * Signature type for the comparision function, which can be passed to the simpleColumn.
 * The return value has to be < 0 if the left is logical smaller than right, 0 if they
 * are equivalent, otherwise > 0.
 */
export type DtSimpleColumnComparatorFunction<T> = (
  left: T,
  right: T,
  name: string,
) => number;

/** Signature type for the hasProblem function, which can be passed to the simpleColumn. */
export type DtSimpleColumnFormatFunction = (
  displayValue: any, // eslint-disable-line @typescript-eslint/no-explicit-any
) => string | DtFormattedValue;

@Directive({})
export abstract class DtSimpleColumnBase<T>
  implements OnInit, OnChanges, OnDestroy
{
  /** Input for the name with which the columnDefinition will register itself to the table. */
  @Input()
  get name(): string {
    return this._name;
  }
  set name(name: string) {
    this._name = name;
    if (this._columnDef) {
      this._columnDef.name = name;
    }
  }
  private _name: string;

  /**
   * Exposes the dtColumnProportion of the dtCell directive for use with simple columns
   */
  @Input('dtColumnProportion')
  get proportion(): number {
    return this._proportion;
  }
  set proportion(value: number) {
    this._proportion = coerceNumberProperty(value);
  }
  private _proportion: number;
  static ngAcceptInputType_proportion: NumberInput;

  /**
   * Text label that should be used for the column header. If this property is not
   * set, the header text will default to the column name.
   */
  @Input() label: string;

  /**
   * Accessor function to retrieve the data should be provided to the cell. If this
   * property is not set, the data cells will assume that the column name is the same
   * as the data property the cells should display.
   */
  @Input() displayAccessor: DtSimpleColumnDisplayAccessorFunction<T>;

  /**
   * Accessor function to retrieve the sortable data from the data provided to the row.
   * If this property is not set, it will fall back to the dataAccessor function. Further fallbacks
   * assume that there is a property on the dataset with the name of the DtSimpleColumn.
   */
  @Input() sortAccessor: DtSimpleColumnSortAccessorFunction<T>;

  /**
   * Formatter function that gets applied to the cell data if given.
   */
  @Input() formatter: DtSimpleColumnFormatFunction;

  /**
   * Evaluation function to retrieve the error/warning state of a cell.
   * If this property is not set, no error indication will be rendered on the cell.
   * The function should either return `error`, `warning` or `undefined` based on which
   * indicator should be enabled on the cell.
   */
  @Input() hasProblem: DtSimpleColumnHasProblemFunction<T>;

  /**
   * Comparison function which should be used instead of the default comparison.
   * If this property is set, the {@link sortAccessor} won't be used for sorting.
   */
  @Input() comparator: DtSimpleColumnComparatorFunction<T>;

  /** Whether the column is sortable */
  @Input()
  get sortable(): boolean {
    return this._sortable;
  }
  set sortable(sortable: boolean) {
    this._sortable = coerceBooleanProperty(sortable);
  }
  private _sortable = true;
  static ngAcceptInputType_sortable: BooleanInput;

  /**
   * @internal
   * Reference to the DtColumnDef defined in the template.
   * Will be passed to the registering table.
   */
  @ViewChild(DtColumnDef, { static: true }) _columnDef: DtColumnDef;

  /**
   * @internal
   * Reference to the DtHeaderCellDef defined in the template.
   * Will be passed to the registering table.
   */
  @ViewChild(DtHeaderCellDef, { static: true }) _headerDef: DtHeaderCellDef;

  /**
   * @internal
   * Reference to the DtCellDef defined in the template.
   * Will be passed to the registering table.
   */
  @ViewChild(DtCellDef, { static: true }) _cellDef: DtCellDef;

  constructor(@Optional() public table: DtTable<T>) {}

  ngOnInit(): void {
    this._syncColumnDefName();
    if (this.table) {
      this._columnDef.cell = this._cellDef;
      this._columnDef.headerCell = this._headerDef;
      this.table.addColumnDef(this._columnDef);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.table &&
      (changes.displayAccessor || changes.sortAccessor || changes.comparator)
    ) {
      this.table._updateColumnAccessors(
        this.name,
        this.displayAccessor,
        this.sortAccessor,
        this.comparator,
      );
    }
  }

  ngOnDestroy(): void {
    if (this.table) {
      this.table.removeColumnDef(this._columnDef);
      this.table._removeColumnAccessors(this.name);
    }
  }

  /**
   * @internal Get data function either returns a data access with the given name or calls the
   * dataAccessor function to get the simpleData for display.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getData(data: T): any {
    const output = this.displayAccessor
      ? this.displayAccessor(data, this.name)
      : (data as any)[this.name]; // eslint-disable-line @typescript-eslint/no-explicit-any
    return this.formatter ? this.formatter(output) : output;
  }

  /** @internal Get the indicator status based on the passed row data. */
  _getIndicator(data: T): DtIndicatorThemePalette {
    return this.hasProblem ? this.hasProblem(data, this.name) : undefined;
  }

  /** Synchronizes the column definition name with the text column name. */
  private _syncColumnDefName(): void {
    if (this._columnDef) {
      this._columnDef.name = this._name;
    }
  }
}
