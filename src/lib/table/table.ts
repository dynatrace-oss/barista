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
import { DtExpandableRow } from './expandable/expandable-row';
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
  @Input() isLoading: boolean;
  private _expandedRow: DtExpandableRow | undefined;
  _uniqueId = `dt-table-${nextUniqueId++}`;
  _multiExpand: boolean;

  @Input()
  get multiExpand(): boolean {
    return this._multiExpand;
  }
  set multiExpand(value: boolean) {
    this._multiExpand = coerceBooleanProperty(value);
  }

  /** Whether the datasource is empty */
  get isEmptyDataSource(): boolean {
    return !(this._data && this._data.length);
  }

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

  /**
   * @deprecated Please use openedChange Output of dt-expandable-row instead.
   * @breaking-change To be removed with 3.0.
   * the expanded row of the table
   */
  get expandedRow(): DtExpandableRow | undefined {
    return this._expandedRow;
  }
  set expandedRow(value: DtExpandableRow | undefined) {
    this._expandedRow = value;
  }

  protected stickyCssClass = 'dt-table-sticky';
}
