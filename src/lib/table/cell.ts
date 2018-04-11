import { Directive, Input } from '@angular/core';
import { CdkCellDef, CdkColumnDef, CdkHeaderCellDef } from '@angular/cdk/table';

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
}

/** Header cell template container that adds the right classes and role. */
@Directive({
  selector: 'dt-header-cell, th[dt-header-cell]',
  host: {
    class: 'dt-table__header-cell',
    role: 'columnheader',
  },
})
export class DtHeaderCell { }

/** Cell template container that adds the right classes and role. */
@Directive({
  selector: 'dt-cell, td[dt-cell]',
  host: {
    class: 'dt-table__cell',
    role: 'gridcell',
  },
})
export class DtCell { }
