import { DtCell, DtColumnDef } from '@dynatrace/angular-components/table';
import { ChangeDetectionStrategy, ViewEncapsulation, Renderer2, ElementRef, SkipSelf, Component, ChangeDetectorRef, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DtTreeTableRow } from './tree-table-row';
import { DtTreeControl } from '@dynatrace/angular-components/core';
import { DtTreeTable } from './tree-table';
import { filter } from 'rxjs/operators';
import { SelectionChange } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';

/** The indentation in px for a level in the tree-table */
const DT_TREE_TABLE_INDENT_PX = 16;

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
export class DtTreeTableToggleCell<T> extends DtCell implements OnDestroy, AfterViewInit {
  /** The aria label for the toggle button */
  @Input('aria-label') ariaLabel: string;

  /** @internal Wether the row is expanded */
  get _isExpanded(): boolean {
    return this._treeControl.isExpanded((this._row as DtTreeTableRow<T>).data);
  }
  /** @internal Wether the row is expandable */
  get _expandable(): boolean {
    return this._treeControl.isExpandable((this._row as DtTreeTableRow<T>).data);
  }

  /** @internal the treecontrol registered on the tree-table */
  get _treeControl(): DtTreeControl<T> {
    return this._treeTable.treeControl;
  }

  /** @internal The rowdata for the parent row */
  get _rowData(): T {
    return (this._row as DtTreeTableRow<T>).data;
  }

  private _expansionSub = Subscription.EMPTY;

  /** @internal wrapper element that gets the indentation applied */
  @ViewChild('wrapper') _wrapperElement: ElementRef;

  constructor(
    public _columnDef: DtColumnDef,
    public _changeDetectorRef: ChangeDetectorRef,
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
    @SkipSelf() private _treeTable: DtTreeTable<T>
  ) {
    super(_columnDef, _changeDetectorRef, _renderer, _elementRef);
    // subscribe to changes in the expansionmodel and check if rowsData is part of the added or removed
    this._expansionSub = this._treeControl.expansionModel.changed.pipe(
      filter((changed: SelectionChange<T>) => changed.added.includes(this._rowData) || changed.removed.includes(this._rowData)))
      .subscribe(() => {
        this._changeDetectorRef.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    this._setIndent();
  }

  ngOnDestroy(): void {
    this._expansionSub.unsubscribe();
  }

  /** The padding indent value for the tree node. Returns a padding left and a padding right value */
  private _paddingIndent(): number | null {
    const treeControl = this._treeTable.treeControl;
    const row = this._row as DtTreeTableRow<T>;
    const nodeLevel = (row.data && treeControl.getLevel)
      ? treeControl.getLevel(row.data)
      : null;
    return nodeLevel ? nodeLevel * DT_TREE_TABLE_INDENT_PX : null;
  }
  /** Sets the padding on the cell */
  private _setIndent(): void {
    const padding = this._paddingIndent();
    this._renderer.setStyle(this._wrapperElement.nativeElement, 'padding-left', `${padding}px`);
  }
}
