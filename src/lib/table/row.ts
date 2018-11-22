import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation, ContentChildren, QueryList, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CDK_ROW_TEMPLATE, CdkHeaderRow, CdkHeaderRowDef, CdkRow, CdkRowDef } from '@angular/cdk/table';
import { DtCell } from './cell';
import { DtTable } from './table';
import { merge, Subscription } from 'rxjs';

/**
 * Header row definition for the dt-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
@Directive({
  selector: '[dtHeaderRowDef]',
  providers: [{provide: CdkHeaderRowDef, useExisting: DtHeaderRowDef}],
  inputs: ['columns: dtHeaderRowDef', 'sticky: dtHeaderRowDefSticky'],
})
export class DtHeaderRowDef extends CdkHeaderRowDef { }

/**
 * Data row definition for the dt-table.
 * Captures the header row's template and other row properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
@Directive({
  exportAs: 'dtRowDef',
  selector: '[dtRowDef]',
  providers: [{provide: CdkRowDef, useExisting: DtRowDef}],
  inputs: ['columns: dtRowDefColumns', 'when: dtRowDefWhen'],
})
export class DtRowDef<T> extends CdkRowDef<T> { }

/** Header template container that contains the cell outlet. Adds the right class and role. */
@Component({
  moduleId: module.id,
  selector: 'dt-header-row',
  template: CDK_ROW_TEMPLATE,
  styleUrls: ['./scss/header-row.scss'],
  host: {
    class: 'dt-header-row',
    role: 'row',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtHeaderRow',
})
export class DtHeaderRow extends CdkHeaderRow { }

/** Data row template container that contains the cell outlet. Adds the right class and role. */
@Component({
  moduleId: module.id,
  selector: 'dt-row',
  template: CDK_ROW_TEMPLATE,
  styleUrls: ['./scss/row.scss'],
  host: {
    class: 'dt-row',
    role: 'row',
    '[class.error]': '_hasProblem === "error"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtRow',
})
export class DtRow extends CdkRow implements OnDestroy {

  static mostRecentRow: DtRow | null = null;

  private _cells = new Set<DtCell>();
  private _cellStateChangesSub = Subscription.EMPTY;

  _hasProblem: 'error' | 'warning' | null = null;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {
    super();
    DtRow.mostRecentRow = this;
  }

  ngOnDestroy(): void {
    if (DtRow.mostRecentRow === this) {
      DtRow.mostRecentRow = null;
    }
    this._cellStateChangesSub.unsubscribe();
  }

  _registerCell(cell: DtCell): void {
    this._cells.add(cell);
    this._listenForStateChanges();
  }

  _unregisterCell(cell: DtCell): void {
    this._cells.delete(cell);
    this._listenForStateChanges();
  }

  private _listenForStateChanges(): void{
    this._cellStateChangesSub.unsubscribe();
    const cells = Array.from(this._cells.values());
    this._cellStateChangesSub = merge(...(cells.map((cell) => cell._stateChanges))).subscribe(() => {
      const problems = cells.filter((cell) => cell.hasError || cell.hasWarning);
      const hasError = !!problems.find((cell) => cell.hasError);
      const hasWarning = !!problems.find((cell) => cell.hasWarning);
      this._hasProblem = hasError ? 'error' : (hasWarning ? 'warning' : null);
      console.log(hasError);
      this._changeDetectorRef.markForCheck();
    });
  }
}
