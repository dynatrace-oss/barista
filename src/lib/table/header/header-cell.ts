import { CdkHeaderCellDef } from '@angular/cdk/table';
import { Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import { DtColumnDef, _updateDtColumnStyles } from '../cell';

/**
 * Header cell definition for the dt-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[dtHeaderCellDef]',
  exportAs: 'dtHeaderCellDef',
  providers: [{ provide: CdkHeaderCellDef, useExisting: DtHeaderCellDef }],
})
export class DtHeaderCellDef extends CdkHeaderCellDef {}

/** Header cell template container that adds the right classes and role. */
@Directive({
  selector: 'dt-header-cell',
  exportAs: 'dtHeaderCell',
  host: {
    class: 'dt-header-cell',
    role: 'columnheader',
  },
})
export class DtHeaderCell implements OnDestroy {
  /** Destroy subject which will fire when the component gets destroyed. */
  private _destroy = new Subject<void>();

  constructor(columnDef: DtColumnDef, renderer: Renderer2, elem: ElementRef) {
    columnDef._stateChanges
      .pipe(
        startWith(null),
        takeUntil(this._destroy),
      )
      .subscribe(() => {
        _updateDtColumnStyles(columnDef, elem, renderer);
      });
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }
}
