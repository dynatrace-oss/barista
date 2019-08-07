import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ViewEncapsulation,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { CDK_ROW_TEMPLATE, CdkRow, CdkRowDef } from '@angular/cdk/table';
import { DtCell } from './cell';
import { merge, Subscription } from 'rxjs';
import {
  replaceCssClass,
  addCssClass,
  removeCssClass,
} from '@dynatrace/angular-components/core';

/**
 * Data row definition for the dt-table.
 * Captures the header row's template and other row properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
@Directive({
  selector: '[dtRowDef]',
  exportAs: 'dtRowDef',
  providers: [{ provide: CdkRowDef, useExisting: DtRowDef }],
  inputs: ['columns: dtRowDefColumns', 'when: dtRowDefWhen'],
})
export class DtRowDef<T> extends CdkRowDef<T> {}

/** Data row template container that contains the cell outlet. Adds the right class and role. */
@Component({
  moduleId: module.id,
  selector: 'dt-row',
  template: CDK_ROW_TEMPLATE,
  styleUrls: ['./row.scss'],
  host: {
    class: 'dt-row',
    role: 'row',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtRow',
})
export class DtRow extends CdkRow implements OnDestroy {
  /**
   * @internal
   * Necessary due to the fact that we cannot get the DtRow via normal DI
   */
  static mostRecentRow: DtRow | null = null;

  protected _cells = new Set<DtCell>();
  private _cellStateChangesSub = Subscription.EMPTY;

  /**
   * @internal
   * Returns the array of registered cells
   */
  get _registeredCells(): DtCell[] {
    return Array.from(this._cells);
  }

  constructor(protected _elementRef: ElementRef) {
    super();
    DtRow.mostRecentRow = this;
  }

  ngOnDestroy(): void {
    if (DtRow.mostRecentRow === this) {
      DtRow.mostRecentRow = null;
    }
    this._cellStateChangesSub.unsubscribe();
  }

  /**
   * @internal
   * The cell registers here and the listeners is added to apply the correct css clases
   */
  _registerCell(cell: DtCell): void {
    this._cells.add(cell);
    this._listenForStateChanges();
  }

  /**
   * @internal
   * The cell unregisters here and the listeners are updated
   */
  _unregisterCell(cell: DtCell): void {
    this._cells.delete(cell);
    this._listenForStateChanges();
  }

  private _listenForStateChanges(): void {
    this._cellStateChangesSub.unsubscribe();
    const cells = Array.from(this._cells.values());
    this._cellStateChangesSub = merge(
      ...cells.map(cell => cell._stateChanges),
    ).subscribe(() => {
      this._applyCssClasses(cells);
    });
  }

  private _applyCssClasses(cells: DtCell[]): void {
    const hasError = !!cells.find(cell => cell.hasError);
    const hasWarning = !!cells.find(cell => cell.hasWarning);
    const hasIndicator = hasError || hasWarning;
    if (hasIndicator) {
      addCssClass(this._elementRef.nativeElement, 'dt-table-row-indicator');
    } else {
      removeCssClass(this._elementRef.nativeElement, 'dt-table-row-indicator');
    }

    if (hasWarning) {
      replaceCssClass(
        this._elementRef.nativeElement,
        'dt-color-error',
        'dt-color-warning',
      );
    } else {
      removeCssClass(this._elementRef.nativeElement, 'dt-color-warning');
    }

    if (hasError) {
      replaceCssClass(
        this._elementRef.nativeElement,
        'dt-color-warning',
        'dt-color-error',
      );
    } else {
      removeCssClass(this._elementRef.nativeElement, 'dt-color-error');
    }
  }
}
