import {
  Input,
  ViewChild,
  Optional,
  OnDestroy,
  OnInit } from '@angular/core';
import { DtColumnDef, DtCellDef } from '../cell';
import { DtTable } from '../table';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DtIndicatorThemePalette } from '@dynatrace/angular-components/core';
import { DtFormattedValue } from '@dynatrace/angular-components/formatters';
import { DtHeaderCellDef } from '../header';

/** Signature type for the dataAccessor function which can be passed to the simpleColumn. */
// tslint:disable-next-line: no-any
export type DtSimpleColumnDisplayAccessorFunction<T> = (data: T, name: string) => any;

/** Signature type for the sortAccessor function which can be passed to the simpleColumn. */
// tslint:disable-next-line: no-any
export type DtSimpleColumnSortAccessorFunction<T> = (data: T, name: string) => string|number;

/** Signature type for the hasProblem function, which can be passed to the simpleColumn. */
// tslint:disable-next-line: no-any
export type DtSimpleColumnHasProblemFunction<T> = (data: T, name: string) => DtIndicatorThemePalette;

/** Signature type for the hasProblem function, which can be passed to the simpleColumn. */
// tslint:disable-next-line: no-any
export type DtSimpleColumnFormatFunction = (displayValue: any) => string|DtFormattedValue;

export abstract class DtSimpleColumnBase<T> implements OnInit, OnDestroy {

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
  _name: string;

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
   * Formatter function that gets applied to the celldata if given.
   */
  @Input() formatter: DtSimpleColumnFormatFunction;

  /**
   * Evaluation function to retreive the error/warning state of a cell.
   * If this property is not set, no error indication will be rendered on the cell.
   * The function should either return `error`, `warning` or `undefined` based on which
   * indicator should be enabled on the cell.
   */
  @Input() hasProblem: DtSimpleColumnHasProblemFunction<T>;

  /** Whether the column is sortable */
  private _sortable = true;
  @Input()
  get sortable(): boolean {
    return this._sortable;
  }
  set sortable(sortable: boolean) {
    this._sortable = coerceBooleanProperty(sortable);
  }

  /** @internal Reference to the DtColumnDef defined in the template. Will be passed to the registering table. */
  @ViewChild(DtColumnDef, { static: true }) _columnDef: DtColumnDef;

  @ViewChild(DtHeaderCellDef, { static: true }) _headerDef: DtHeaderCellDef;
  @ViewChild(DtCellDef, { static: true }) _cellDef: DtCellDef;

  constructor(@Optional() public table: DtTable<T>) { }

  ngOnInit(): void {
    this._syncColumnDefName();
    if (this.table) {
      this._columnDef.cell = this._cellDef;
      this._columnDef.headerCell = this._headerDef;
      this.table.addColumnDef(this._columnDef);
    }
  }

  ngOnDestroy(): void {
    if (this.table) {
      this.table.removeColumnDef(this._columnDef);
    }
  }

  /**
   * @internal Get data function either returns a data access with the given name or calls the
   * dataAccessor function to get the simpleData for display.
   */
  // tslint:disable-next-line: no-any
  _getData(data: T): any {
    // tslint:disable-next-line: no-any
    const output = this.displayAccessor ? this.displayAccessor(data, this.name) : (data as any)[this.name];
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
