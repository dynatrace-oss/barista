import { DtColumnDef, _updateDtColumnStyles } from '../cell';
import { Renderer2, ElementRef, Directive } from '@angular/core';
import { CdkHeaderCellDef } from '@angular/cdk/table';

/**
 * Header cell definition for the dt-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[dtHeaderCellDef]',
  providers: [{provide: CdkHeaderCellDef, useExisting: DtHeaderCellDef}],
})
export class DtHeaderCellDef extends CdkHeaderCellDef { }

/** Header cell template container that adds the right classes and role. */
@Directive({
  selector: 'dt-header-cell',
  host: {
    class: 'dt-header-cell',
    role: 'columnheader',
  },
  exportAs: 'dtHeaderCell',
})
export class DtHeaderCell {
  // tslint:disable-next-line:no-unused-variable
  constructor(columnDef: DtColumnDef, renderer: Renderer2, elem: ElementRef) {
    _updateDtColumnStyles(columnDef, elem, renderer);
  }
}
