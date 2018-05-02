import { Directive, Input, Component, ViewEncapsulation, ChangeDetectionStrategy, Renderer2, ElementRef } from '@angular/core';
import { CdkCellDef, CdkColumnDef, CdkHeaderCellDef } from '@angular/cdk/table';

export const DT_COLUMN_TYPES = {
  left: ['left', 'text', 'id'],
  center: ['center', 'icon', 'control'],
  right: ['right', 'number', 'date', 'ip'],
};

/**
 * Cell definition for the dt-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
@Directive({
  selector: '[dtCellDef]',
  providers: [{provide: CdkCellDef, useExisting: DtCellDef}],
})
export class DtCellDef extends CdkCellDef { }

/**
 * Header cell definition for the dt-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[dtHeaderCellDef]',
  providers: [{provide: CdkHeaderCellDef, useExisting: DtHeaderCellDef}],
})
export class DtHeaderCellDef extends CdkHeaderCellDef { }

/**
 * Column definition for the dt-table.
 * Defines a set of cells available for a table column.
 */
@Directive({
  selector: '[dtColumnDef]',
  providers: [{provide: CdkColumnDef, useExisting: DtColumnDef}],
})
export class DtColumnDef extends CdkColumnDef {
  /** Unique name for this column. */
  // tslint:disable-next-line:no-input-rename
  @Input('dtColumnDef') name: string;
  // tslint:disable-next-line:no-input-rename
  @Input('dtColumnType') type: string;
  // tslint:disable-next-line:no-input-rename
  @Input('dtColumnProportion') proportion = 1;
  // tslint:disable-next-line:no-input-rename
  @Input('dtColumnMinWidth') minWidth: string;
}

/** Header cell template container that adds the right classes and role. */
@Component({
  selector: 'dt-header-cell',
  template: '<ng-content></ng-content>',
  styleUrls: ['./scss/header-cell.scss'],
  host: {
    class: 'dt-header-cell',
    role: 'columnheader',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtHeaderCell',
})
export class DtHeaderCell {
  // tslint:disable-next-line:no-unused-variable
  constructor(private _columnDef: DtColumnDef, private _renderer: Renderer2, private _elem: ElementRef) {
    setColumnClass.bind(this)();
  }
}

/** Cell template container that adds the right classes and role. */
@Component({
  selector: 'dt-cell',
  template: '<ng-content></ng-content>',
  styleUrls: ['./scss/cell.scss'],
  host: {
    class: 'dt-cell',
    role: 'gridcell',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtCell',
})
export class DtCell {
  // tslint:disable-next-line:no-unused-variable
  constructor(private _columnDef: DtColumnDef, private _renderer: Renderer2, private _elem: ElementRef) {
    setColumnClass.bind(this)();
  }
}

function getColumnAlignmentClass(columnType: string): string | void {
  if (!columnType) { return undefined; }
  const [cssAlignmentClass] = Object.keys(DT_COLUMN_TYPES).filter((idx) => (DT_COLUMN_TYPES[idx].includes(columnType)));

  return cssAlignmentClass;
}

function setColumnClass(): void {
  const { cssClassFriendlyName, type, proportion, minWidth } = this._columnDef;
  const { nativeElement } = this._elem;
  const cssAlignmentClass = getColumnAlignmentClass(type) || 'left';

  this._renderer.addClass(nativeElement, `dt-align-${cssAlignmentClass}`);
  this._renderer.setStyle(nativeElement, 'flex-grow', proportion);
  this._renderer.setStyle(nativeElement, 'flex-shrink', proportion);
  if (typeof minWidth === 'string') {
    this._renderer.setStyle(nativeElement, 'min-width', minWidth);
  }
}
