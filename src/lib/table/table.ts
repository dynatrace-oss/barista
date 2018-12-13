import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { CdkTable } from '@angular/cdk/table';
import { DtExpandableRow } from './expandable-row';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

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
    'class': 'dt-table',
    '[class.dt-table-interactive-rows]': 'interactiveRows',
  },
})
export class DtTable<T> extends CdkTable<T> implements AfterContentChecked {
  @Input() isLoading: boolean;
  private _interactiveRows: boolean;
  private _expandedRow: DtExpandableRow | undefined;

  @Input()
  set interactiveRows(value: boolean) {
    this._interactiveRows = coerceBooleanProperty(value);
  }
  get interactiveRows(): boolean {
    return this._interactiveRows;
  }

  get isEmptyDataSource(): boolean {
    return !(this._data.length);
  }

  renderRows(): void {
    super.renderRows();

    if (this.isEmptyDataSource) {
      this._changeDetectorRef.markForCheck();
    }
  }

  /** the expanded row of the table */
  get expandedRow(): DtExpandableRow | undefined {
    return this._expandedRow;
  }
  set expandedRow(value: DtExpandableRow | undefined) {
    this._expandedRow = value;
  }

  protected stickyCssClass = 'dt-table-sticky';

}
