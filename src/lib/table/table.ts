import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
  ContentChildren,
  QueryList,
  ViewRef,
  IterableDiffers,
  ChangeDetectorRef,
  ElementRef,
  Attribute,
} from '@angular/core';
import { CdkTable } from '@angular/cdk/table';
import { DtExpandableRow } from './expandable-row';
import { DtRow } from './row';
import { Subject } from 'rxjs';
import { HasInteractiveRows, mixinHasInteractiveRows } from './interactive-rows';

// tslint:disable-next-line:no-any
export const _DtTableMixinBase = mixinHasInteractiveRows<any>(CdkTable);

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
  inputs: ['interactiveRows', 'dataSource', 'trackBy'],
})
export class DtTable<T> extends _DtTableMixinBase implements AfterContentChecked, HasInteractiveRows {
  @Input() isLoading: boolean;
  private _expandedRow: DtExpandableRow | undefined;

  _stateChanges = new Subject<void>();

  _outletViews: ViewRef[] = [];

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
