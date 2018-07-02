import {AfterContentChecked, ChangeDetectionStrategy, Component, Input, ViewEncapsulation,} from '@angular/core';
import {CdkTable} from '@angular/cdk/table';
import {DtExpandableRow} from './expandable-row';

@Component({
  moduleId: module.id,
  selector: 'dt-table',
  styleUrls: ['./scss/table.scss'],
  templateUrl: './table.html',
  exportAs: 'dtTable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  host: {
    class: 'dt-table',
  },
})
export class DtTable<T> extends CdkTable<T> implements AfterContentChecked {
  @Input() isLoading: boolean;
  private _expandedRow: DtExpandableRow | undefined;

  get isEmptyDataSource(): boolean {
    const isEmptyArray = Array.isArray(this.dataSource) && !this.dataSource.length;
    const isEmptyArrayLike = this.dataSource && !(this.dataSource as T[]).length;

    return !this.dataSource || isEmptyArray || isEmptyArrayLike;
  }

  /** the expanded row of the table */
  get expandedRow(): DtExpandableRow | undefined {
    return this._expandedRow;
  }
  set expandedRow(value: DtExpandableRow | undefined) {
    this._expandedRow = value;
  }
}
