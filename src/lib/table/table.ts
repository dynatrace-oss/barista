import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
  IterableDiffers,
  ChangeDetectorRef,
  ElementRef,
  Attribute,
} from '@angular/core';
import { DtExpandableRow, DtExpandableRowChangeEvent } from './expandable/expandable-row';
import { _DtTableBase} from './base-table';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

let nextUniqueId = 0;
@Component({
  moduleId: module.id,
  selector: 'dt-table',
  styleUrls: ['./table.scss'],
  templateUrl: './table.html',
  exportAs: 'dtTable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  host: {
    'class': 'dt-table',
    '[class.dt-table-interactive-rows]': 'interactiveRows',
  },
})
export class DtTable<T> extends _DtTableBase<T> {
  private _expandableRows = new Set<DtExpandableRow>();
  private _multiExpand: boolean; // TODO: discuss default value with UX, should maybe change from false to true
  private _loading: boolean;
  _uniqueId = `dt-table-${nextUniqueId++}`;

  /** Whether the loading state should be displayed. */
  @Input()
  get loading(): boolean { return this._loading; }
  set loading(value: boolean) { this._loading = coerceBooleanProperty(value); }

  /**
   * @deprecated Use loading instead.
   * @breaking-change To be removed with 3.0.0.
   */
  @Input()
  get isLoading(): boolean { return this._loading; }
  set isLoading(value: boolean) { this._loading = coerceBooleanProperty(value); }

  /** Whether multiple rows can be expanded at a time. */
  @Input()
  get multiExpand(): boolean { return this._multiExpand; }
  set multiExpand(value: boolean) { this._multiExpand = coerceBooleanProperty(value); }

  /** Whether the datasource is empty. */
  get isEmptyDataSource(): boolean {
    return !(this._data && this._data.length);
  }

  /**
   * @deprecated Please use openedChange Output of dt-expandable-row instead.
   * @breaking-change To be removed with 3.0.0.
   * the expanded row of the table
   */
  get expandedRow(): DtExpandableRow | undefined {
    return Array.from(this._expandableRows)
      .filter((row) => row.expanded)[0];
  }
  set expandedRow(value: DtExpandableRow | undefined) { }

  constructor(
    differs: IterableDiffers,
    changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef,
    @Attribute('role') role: string
  ) {
    super(differs, changeDetectorRef, elementRef, role);
  }

  renderRows(): void {
    super.renderRows();
    if (this.isEmptyDataSource) {
      this._changeDetectorRef.markForCheck();
    }
  }

  _registerExpandableRow(row: DtExpandableRow): void {
    this._expandableRows.add(row);
  }

  _unregisterExpandableRow(row: DtExpandableRow): void {
    this._expandableRows.delete(row);
  }

  protected stickyCssClass = 'dt-table-sticky';
}
