/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import { CDK_ROW_TEMPLATE, CdkRow, CdkRowDef } from '@angular/cdk/table';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription, merge } from 'rxjs';

import {
  _addCssClass,
  _removeCssClass,
  _replaceCssClass,
} from '@dynatrace/barista-components/core';

import { DtCell } from './cell';

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
   * @internal Necessary due to the fact that we cannot get the DtRow via normal DI
   */
  static _mostRecentRow: DtRow | null = null;

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
    DtRow._mostRecentRow = this;
  }

  ngOnDestroy(): void {
    if (DtRow._mostRecentRow === this) {
      DtRow._mostRecentRow = null;
    }
    this._cellStateChangesSub.unsubscribe();
  }

  /**
   * @internal
   * The cell registers here and the listeners is added to apply the correct css classes
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
      _addCssClass(this._elementRef.nativeElement, 'dt-table-row-indicator');
    } else {
      _removeCssClass(this._elementRef.nativeElement, 'dt-table-row-indicator');
    }

    if (hasWarning) {
      _replaceCssClass(
        this._elementRef.nativeElement,
        'dt-color-error',
        'dt-color-warning',
      );
    } else {
      _removeCssClass(this._elementRef.nativeElement, 'dt-color-warning');
    }

    if (hasError) {
      _replaceCssClass(
        this._elementRef.nativeElement,
        'dt-color-warning',
        'dt-color-error',
      );
    } else {
      _removeCssClass(this._elementRef.nativeElement, 'dt-color-error');
    }
  }
}
