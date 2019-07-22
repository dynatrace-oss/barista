import { Component, ElementRef, Input, SkipSelf } from '@angular/core';
import { DtRow } from '@dynatrace/angular-components/table';
import { CdkRow } from '@angular/cdk/table';
import { DtTreeTable } from './tree-table';

@Component({
  selector: 'dt-tree-table-row',
  templateUrl: 'tree-table-row.html',
  host: {
    '[attr.aria-expanded]': '_isExpanded',
    '[attr.aria-level]': '_level',
    role: 'row',
    class: 'dt-tree-table-row',
  },
  styleUrls: ['tree-table-row.scss'],
  providers: [{ provide: CdkRow, useExisting: DtTreeTableRow }],
})
export class DtTreeTableRow<T> extends DtRow {
  /** The data for this row. This needs to be set in order for the tree control to work */
  @Input()
  get data(): T {
    return this._data;
  }
  set data(data: T) {
    this._data = data;
  }

  /** @internal Wether the row is expanded/collapsed */
  get _isExpanded(): boolean {
    return this._treeTable.treeControl.isExpanded(this._data);
  }

  /** @internal The level for the row */
  get _level(): number {
    return this._treeTable.treeControl.getLevel(this._data);
  }

  private _data: T;

  constructor(
    elementRef: ElementRef,
    @SkipSelf() private _treeTable: DtTreeTable<T>,
  ) {
    super(elementRef);
  }
}
