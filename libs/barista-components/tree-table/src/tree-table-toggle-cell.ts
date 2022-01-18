/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { SelectionChange } from '@angular/cdk/collections';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  SkipSelf,
  ViewChild,
  ViewEncapsulation,
  Output,
} from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { DtTreeControl } from '@dynatrace/barista-components/core';
import { DtCell, DtColumnDef } from '@dynatrace/barista-components/table';

import { DtTreeTable } from './tree-table';
import { DtTreeTableRow } from './tree-table-row';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

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
export class DtTreeTableToggleCell<T>
  extends DtCell
  implements OnDestroy, AfterViewInit
{
  /** The aria label for the toggle button */
  @Input('aria-label') ariaLabel: string;
  /** Aria reference to a label describing the toggle button. */
  @Input('aria-labelledby') ariaLabelledBy: string;

  /** Event emitted when the cell's expandable state changes. */
  @Output()
  readonly expandChange: Observable<boolean> = this._treeControl.expansionModel.changed.pipe(
    filter(
      (changed: SelectionChange<T>) =>
        (changed.added.includes(this._rowData) ||
          changed.removed.includes(this._rowData)) &&
        this._treeControl.isExpandable(this._rowData),
    ),
    map((changed: SelectionChange<T>) => changed.added.includes(this._rowData)),
  );

  /** The expanded state of the cell and therefore also of the row */
  @Input()
  get expanded(): boolean {
    return this._isExpanded;
  }
  set expanded(value: boolean) {
    const shouldExpand = coerceBooleanProperty(value);

    // Only update expanded state if it actually changed.
    if (this._isExpanded !== shouldExpand) {
      if (shouldExpand) {
        this._expand();
      } else {
        this._collapse();
      }
    }
  }

  /** Event that emits every time the cell/row is expanded */
  @Output('expanded')
  readonly treeExpanded: Observable<boolean> = this.expandChange.pipe(
    filter((v) => v),
  );

  /** Event that emits every time the cell/row is collapsed */
  @Output()
  readonly collapsed: Observable<boolean> = this.expandChange.pipe(
    filter((v) => !v),
  );

  /** @internal Wether the row is expanded */
  get _isExpanded(): boolean {
    return this._treeControl.isExpanded((this._row as DtTreeTableRow<T>).data);
  }
  /** @internal Wether the row is expandable */
  get _expandable(): boolean {
    return this._treeControl.isExpandable(
      (this._row as DtTreeTableRow<T>).data,
    );
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
  @ViewChild('wrapper', { static: true }) _wrapperElement: ElementRef;

  constructor(
    public _columnDef: DtColumnDef,
    public _changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef,
    @SkipSelf() private _treeTable: DtTreeTable<T>,
  ) {
    super(_columnDef, _changeDetectorRef, elementRef);
    // subscribe to changes in the expansionmodel and check if rowsData is part of the added or removed
    this._expansionSub = this._treeControl.expansionModel.changed
      .pipe(
        filter(
          (changed: SelectionChange<T>) =>
            changed.added.includes(this._rowData) ||
            changed.removed.includes(this._rowData),
        ),
      )
      .subscribe(() => {
        this._changeDetectorRef.markForCheck();
      });
  }

  /** @internal triggers the treecontrols toggle method with current rowdata  */
  _toggle(): void {
    this._treeControl.toggle(this._rowData);
  }

  /** @internal triggers the treecontrols expand method with current rowdata  */
  _expand(): void {
    this._treeControl.expand(this._rowData);
  }

  /** @internal triggers the treecontrols toggle method with current rowdata  */
  _collapse(): void {
    this._treeControl.collapse(this._rowData);
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
    const nodeLevel =
      row.data && treeControl.getLevel ? treeControl.getLevel(row.data) : null;
    return nodeLevel ? nodeLevel * DT_TREE_TABLE_INDENT_PX : null;
  }
  /** Sets the padding on the cell */
  private _setIndent(): void {
    const padding = this._paddingIndent();
    const element: HTMLElement = this._wrapperElement.nativeElement;
    if (element && element.style) {
      element.style.paddingLeft = `${padding}px`;
    }
  }
}
