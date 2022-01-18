/**
 * @license
 * Copyright 2021 Dynatrace LLC
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
  isDefined,
} from '@dynatrace/barista-components/core';

import { DtCell } from './cell';
import {
  style,
  transition,
  animate,
  trigger,
  AnimationEvent,
  keyframes,
} from '@angular/animations';

import type { DtOrderCell } from './order/order-cell';

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
    '[@orderChangedIndicatorAnimation]': '_orderChangedIndicatorAnimationState',
    '(@orderChangedIndicatorAnimation.done)':
      '_handleOrderChangedAnimationEvent($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtRow',
  animations: [
    trigger('orderChangedIndicatorAnimation', [
      transition('changed => void', [
        animate(
          '1500ms ease-out',
          keyframes([
            style({
              'box-shadow': '2px 2px 8px 0 #b7b7b7',
              'z-index': 1,
            }),
            style({
              'box-shadow': '0 0 8px 0 transparent',
            }),
          ]),
        ),
      ]),
    ]),
  ],
})
export class DtRow extends CdkRow implements OnDestroy {
  /**
   * @internal Necessary due to the fact that we cannot get the DtRow via normal DI
   */
  static _mostRecentRow: DtRow | null = null;

  /**
   * @internal Animation state used for the row's animation indicating that
   * the order has changed and the row jumped to a new spot
   */
  _orderChangedIndicatorAnimationState: 'void' | 'changed' = 'void';

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

  /**
   * Reset the row's animation state and the order cell's order changed property
   *
   * @param $event
   */
  _handleOrderChangedAnimationEvent($event: AnimationEvent): void {
    if (
      $event.fromState === 'void' &&
      $event.toState === 'changed' &&
      $event.phaseName === 'done'
    ) {
      this._orderChangedIndicatorAnimationState = 'void';
      const orderCell = this._getChangedOrderCell();

      if (orderCell) {
        orderCell._animateOrderChangedIndicator = false;
      }
    }
  }

  private _listenForStateChanges(): void {
    this._cellStateChangesSub.unsubscribe();
    const cells = Array.from(this._cells.values());
    this._cellStateChangesSub = merge(
      ...cells.map((cell) => cell._stateChanges),
    ).subscribe(() => {
      this._applyCssClasses(cells);
    });
  }

  private _applyCssClasses(cells: DtCell[]): void {
    const hasError = !!cells.find((cell) => cell.hasError);
    const hasWarning = !!cells.find((cell) => cell.hasWarning);
    const hasRecovered = !!cells.find((cell) => cell.hasRecovered);
    const isCritical = !!cells.find((cell) => cell.isCritical);
    const hasIndicator = hasError || hasWarning || hasRecovered || isCritical;
    const orderCell = this._getChangedOrderCell();
    if (hasIndicator) {
      _addCssClass(this._elementRef.nativeElement, 'dt-table-row-indicator');
    } else {
      _removeCssClass(this._elementRef.nativeElement, 'dt-table-row-indicator');
    }

    if (hasRecovered) {
      _removeCssClass(this._elementRef.nativeElement, 'dt-color-error');
      _replaceCssClass(
        this._elementRef.nativeElement,
        'dt-color-warning',
        'dt-color-recovered',
      );
    } else {
      _removeCssClass(this._elementRef.nativeElement, 'dt-color-recovered');
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

    if (isCritical) {
      _replaceCssClass(
        this._elementRef.nativeElement,
        'dt-color-error',
        'dt-color-critical',
      );
    } else {
      _removeCssClass(this._elementRef.nativeElement, 'dt-color-critical');
    }

    if (orderCell) {
      this._orderChangedIndicatorAnimationState = 'changed';
    }
  }

  /**
   * Returns the row's order cell if it contains one and the cell's order
   * has been changed, indicated by the '_animateOrderChangedIndicator' property
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _getChangedOrderCell(): DtOrderCell<any> | undefined {
    return Array.from(this._cells.values()).find(
      // Prevent circular reference by checking for the order-cell-specific property being defined
      // instead of checking for the cell being an instance of DtOrderCell
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cell: DtOrderCell<any>) =>
        isDefined(cell._animateOrderChangedIndicator) &&
        cell._animateOrderChangedIndicator,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as DtOrderCell<any>;
  }
}
