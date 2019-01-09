import { DtCell, DtColumnDef } from '@dynatrace/angular-components/table';
import { ChangeDetectionStrategy, ViewEncapsulation, Renderer2, ElementRef, SkipSelf, Component, ChangeDetectorRef, Input } from '@angular/core';
import { DtTreeTableRow } from './tree-table-row';
import { DtTreeControl } from './tree-table-control';
import { DtTreeTable } from './tree-table';

/** Cell template container that adds the right classes, role, and handles indentation */
@Component({
  selector: 'dt-tree-table-toggle-cell',
  templateUrl: 'tree-table-toggle-cell.html',
  styleUrls: ['tree-table-toggle-cell.scss'],
  host: {
    class: 'dt-cell dt-tree-toggle-cell',
    role: 'gridcell',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  exportAs: 'dtTreeTableToggleCell',
})
export class DtTreeTableToggleCell<T> extends DtCell {
  @Input('aria-label') ariaLabel: string;

  /** @internal Wether the row is expanded */
  get _isExpanded(): boolean {
    return this._treeControl.isExpanded((this._row as DtTreeTableRow<T>).data);
  }
  /** @internal Wether the row is expandable */
  get _expandable(): boolean {
    return this._treeControl.isExpandable((this._row as DtTreeTableRow<T>).data);
  }

  get _treeControl(): DtTreeControl<T> {
    return this._treeTable.treeControl;
  }

  get _rowData(): T {
    return (this._row as DtTreeTableRow<T>).data;
  }

  private _indent = 16;
  _padding: number | null;

  constructor(
    _columnDef: DtColumnDef,
    _changeDetectorRef: ChangeDetectorRef,
    _renderer: Renderer2,
    _elementRef: ElementRef<any>,
    @SkipSelf() private _treeTable: DtTreeTable<T>,
  ) {
    super(_columnDef, _changeDetectorRef, _renderer, _elementRef);
    // We need this settimeout here because we dont have the information about the row right away.
    // So we need to wait for the next cycle to do the indentation
    setTimeout(() => { this._setPadding(); });
  }

  /** The padding indent value for the tree node. Returns a padding left and a padding right value */
  private _paddingIndent(): number | null {
    const treeControl = this._treeTable.treeControl;
    const row = this._row as DtTreeTableRow<T>;
    const nodeLevel = (row.data && treeControl.getLevel)
      ? treeControl.getLevel(row.data)
      : null;
    return nodeLevel ? nodeLevel * this._indent : null;
  }
  /** Sets the padding on the cell */
  private _setPadding(): void {
    this._padding = this._paddingIndent();
    this._changeDetectorRef.markForCheck();
  }

  
}
