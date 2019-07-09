import { Component, ElementRef } from '@angular/core';
import {
  DtColumnDef,
  _setDtColumnCssClasses,
} from '@dynatrace/angular-components/table';

@Component({
  selector: 'dt-tree-table-header-cell',
  styleUrls: ['tree-table-header-cell.scss'],
  templateUrl: 'tree-table-header-cell.html',
  host: {
    class: 'dt-tree-table-header-cell',
  },
})
export class DtTreeTableHeaderCell {
  constructor(
    private _columnDef: DtColumnDef,
    private _elementRef: ElementRef
  ) {
    _setDtColumnCssClasses(this._columnDef, this._elementRef);
  }
}
