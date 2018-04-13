import { Directive, Input, ComponentRef, Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
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
@Component({
  selector: 'dt-header-cell, th[dt-header-cell]',
  template: '<ng-content></ng-content>',
  styleUrls: ['./scss/header-cell.scss'],
  host: {
    class: 'dt-header-cell',
    role: 'columnheader',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtHeaderRow',
})
export class DtHeaderCell { }

/** Cell template container that adds the right classes and role. */
@Component({
  selector: 'dt-cell, td[dt-cell]',
  template: '<ng-content></ng-content>',
  styleUrls: ['./scss/cell.scss'],
  host: {
    class: 'dt-cell',
    role: 'gridcell',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtHeaderRow',
})
export class DtCell { }
