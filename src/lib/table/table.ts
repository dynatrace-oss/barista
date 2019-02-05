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
import { DtExpandableRow } from './expandable-row';
import { _DtTableBase} from './base-table';

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

  /** Wether the datasource is empty */
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

  /** the expanded row of the table */
  get expandedRow(): DtExpandableRow | undefined {
    return this._expandedRow;
  }
  set expandedRow(value: DtExpandableRow | undefined) {
    this._expandedRow = value;
  }

  protected stickyCssClass = 'dt-table-sticky';

}
