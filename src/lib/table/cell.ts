import { Directive, Input, Component, ViewEncapsulation, ChangeDetectionStrategy, Renderer2, ElementRef } from '@angular/core';
import { CdkCellDef, CdkColumnDef, CdkHeaderCellDef } from '@angular/cdk/table';
import { coerceNumberProperty } from '@angular/cdk/coercion';

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
  @Input('dtColumnAlign') align: string;
  // tslint:disable-next-line:no-input-rename
  @Input('dtColumnProportion') proportion: number;
  // tslint:disable-next-line:no-input-rename
  @Input('dtColumnMinWidth') minWidth: string | number;
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

/** Custom Types for Cell alignments */
type DtTableColumnAlign = 'left' | 'right' | 'center';
type DtTableColumnTypedAlign = 'text' | 'id' | 'icon' | 'control' | 'number' | 'date' | 'ip';

const ALIGNMENT_CAST_MAP = new Map<DtTableColumnAlign | DtTableColumnTypedAlign, DtTableColumnAlign>([
  ['left', 'left'],
  ['text', 'left'],
  ['id', 'left'],
  ['center', 'center'],
  ['icon', 'center'],
  ['control', 'center'],
  ['right', 'right'],
  ['number', 'right'],
  ['date', 'right'],
  ['ip', 'right'],
]);

/** Maps the provided alignment to a css align provided by the cast map. */
function coerceAlignment(value: DtTableColumnAlign | DtTableColumnTypedAlign): DtTableColumnAlign {
  return ALIGNMENT_CAST_MAP.get(value as DtTableColumnTypedAlign) || 'left';
}

/** Set classes name and styles props for columns. */
// TODO: change this function to a cell mixin.
function setColumnClass(): void {
  const { align, proportion, minWidth, cssClassFriendlyName } = this._columnDef;
  const { nativeElement } = this._elem;
  const cssAlignmentClass = coerceAlignment(align);

  this._renderer.addClass(nativeElement, `dt-column-${cssClassFriendlyName}`);
  this._renderer.addClass(nativeElement, `dt-align-${cssAlignmentClass}`);

  const setProportion = coerceNumberProperty(proportion);
  if (setProportion > 0) {
    this._renderer.setStyle(nativeElement, 'flex-grow', setProportion);
    this._renderer.setStyle(nativeElement, 'flex-shrink', setProportion);
  }

  if (minWidth !== undefined) {
    const setMinWidth = coerceNumberProperty(minWidth) ? `${minWidth}px` : minWidth;

    this._renderer.setStyle(nativeElement, 'min-width', setMinWidth);
  }
}
