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

import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { CdkCellDef, CdkColumnDef } from '@angular/cdk/table';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  Host,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  QueryList,
  SkipSelf,
  ViewEncapsulation,
} from '@angular/core';
import {
  isDefined,
  _addCssClass,
  _parseCssValue,
  _removeCssClass,
} from '@dynatrace/barista-components/core';
import { DtIndicator } from '@dynatrace/barista-components/indicator';
import { merge, Subject, Subscription } from 'rxjs';
import { filter, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { DtRow } from './row';
import { DtSort, DtSortEvent } from './sort/sort';

/** Custom Types for Cell alignments */
export type DtTableColumnAlign = 'left' | 'right' | 'center';
export type DtTableColumnTypedAlign =
  | 'text'
  | 'id'
  | 'icon'
  | 'control'
  | 'number'
  | 'date'
  | 'ip';

/**
 * Cell definition for the dt-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
@Directive({
  selector: '[dtCellDef]',
  exportAs: 'dtCellDef',
  providers: [{ provide: CdkCellDef, useExisting: DtCellDef }],
})
export class DtCellDef extends CdkCellDef {}

/**
 * Column definition for the dt-table.
 * Defines a set of cells available for a table column.
 */
@Directive({
  selector: '[dtColumnDef]',
  exportAs: 'dtColumnDef',
  providers: [{ provide: CdkColumnDef, useExisting: DtColumnDef }],
})
export class DtColumnDef extends CdkColumnDef implements OnChanges {
  /** Unique name for this column. */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('dtColumnDef')
  get name(): string {
    return this._name;
  }
  set name(name: string) {
    this._setNameInput(name);
  }

  /** The alignment of the colums */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('dtColumnAlign') align: DtTableColumnTypedAlign | DtTableColumnAlign =
    'left';

  /** The proportion of the column compared to the others. */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('dtColumnProportion')
  get proportion(): number {
    return this._proportion;
  }
  set proportion(name: number) {
    this._proportion = coerceNumberProperty(name);
  }
  private _proportion: number;
  static ngAcceptInputType_proportion: NumberInput;

  /** The min width of the column. */
  // TODO: Consider switching to ngStyle syntax in the future - value.unit
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('dtColumnMinWidth') minWidth: string | number;

  /** @internal Alignment subject which fires with changes to the alignment input. */
  _stateChanges = new Subject<void>();

  ngOnChanges(): void {
    this._stateChanges.next();
  }
}

type IndicatorType = 'error' | 'warning' | 'recovered' | 'critical';

/** Cell template container that adds the right classes and role. */
@Component({
  selector: 'dt-cell',
  template: '<ng-content></ng-content>',
  styleUrls: ['./cell.scss'],
  host: {
    class: 'dt-cell',
    role: 'gridcell',
    '[class.dt-cell-sorted]': '_isSorted',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtCell',
})
export class DtCell implements AfterContentInit, OnDestroy {
  /** @internal A list of references of the applied indicator. */
  @ContentChildren(DtIndicator, { descendants: true })
  _indicators: QueryList<DtIndicator>;

  /** Whether the cell has an error */
  get hasError(): boolean {
    return this._hasIndicator('error');
  }

  /** Whether the cell has a warning */
  get hasWarning(): boolean {
    return this._hasIndicator('warning');
  }

  /** Whether the cell has recovered */
  get hasRecovered(): boolean {
    return this._hasIndicator('recovered');
  }

  /** Whether the cell is critical */
  get isCritical(): boolean {
    return this._hasIndicator('critical');
  }

  /**
   * @internal
   * Emits whenever the indicators change or one of the inputs on the indicators changes
   */
  _stateChanges = new Subject<void>();
  /**
   * @internal
   * The parent row
   */
  _row: DtRow;

  /**
   * @internal
   * indicates if a cell is sorted, used for displaying a bold value
   */
  _isSorted = false;

  private _sortChangeSubscription: Subscription = Subscription.EMPTY;
  private _destroy = new Subject<void>();

  constructor(
    public _columnDef: DtColumnDef,
    public _changeDetectorRef: ChangeDetectorRef,
    elem: ElementRef,
    @Optional() @SkipSelf() dtSortable?: DtSort,
    @Optional() @Host() private _dtIndicator?: DtIndicator,
  ) {
    if (dtSortable) {
      this._isSorted = dtSortable.active === this._columnDef.name;
      dtSortable.sortChange
        .pipe(takeUntil(this._destroy))
        .subscribe((sort: DtSortEvent) => {
          // If event is void, it is being unregisterd.
          this._isSorted = sort.active === this._columnDef.name;
          this._changeDetectorRef.markForCheck();
        });
    }

    this._columnDef._stateChanges
      .pipe(startWith(null), takeUntil(this._destroy))
      .subscribe(() => {
        _updateDtColumnStyles(this._columnDef, elem);
      });

    if (DtRow._mostRecentRow) {
      this._row = DtRow._mostRecentRow;
      this._row._registerCell(this);
    }
  }

  ngAfterContentInit(): void {
    const indicatorChanges = this._dtIndicator
      ? this._dtIndicator._stateChanges
      : this._indicators.changes.pipe(
          startWith(null),
          filter(() => !!this._indicators.length),
          switchMap(() =>
            merge(
              ...this._indicators.map((indicator) => indicator._stateChanges),
            ),
          ),
        );

    indicatorChanges.pipe(takeUntil(this._destroy)).subscribe(() => {
      this._stateChanges.next();
    });

    Promise.resolve().then(() => {
      this._stateChanges.next();
    });
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();
    this._sortChangeSubscription.unsubscribe();
    this._destroy.next();
    this._destroy.complete();
    if (this._row) {
      this._row._unregisterCell(this);
    }
  }

  private _hasIndicator(indicatorType: IndicatorType): boolean {
    if (this._dtIndicator) {
      return (
        this._dtIndicator.active && this._dtIndicator.color === indicatorType
      );
    }

    return (
      this._indicators &&
      isDefined(
        this._indicators.find(
          (indicator) => indicator.active && indicator.color === indicatorType,
        ),
      )
    );
  }
}

const ALIGNMENT_CAST_MAP = new Map<DtTableColumnTypedAlign, DtTableColumnAlign>(
  [
    ['icon', 'center'],
    ['control', 'center'],
    ['number', 'right'],
    ['date', 'right'],
    ['ip', 'right'],
  ],
);

/**
 * Maps the provided alignment to a css align provided by the cast map, if there's no coincidence
 * return the provided one. In the latter case will be handle with the default left-aligned SCSS style.
 *
 * This will be also 'type checked' with the Template Compiler feature from @Angular6.
 */
function coerceAlignment(
  value: DtTableColumnAlign | DtTableColumnTypedAlign,
): DtTableColumnAlign {
  return (
    ALIGNMENT_CAST_MAP.get(value as DtTableColumnTypedAlign) ||
    (value as DtTableColumnAlign)
  );
}

/** @internal Sets the css classes on a DtColumn */
export function _setDtColumnCssClasses(
  columnDef: DtColumnDef,
  elementRef: ElementRef,
): void {
  const { align, cssClassFriendlyName } = columnDef;
  const cssAlignmentClass = coerceAlignment(align);

  _removeCssClass(elementRef.nativeElement, 'dt-table-column-align-left');
  _removeCssClass(elementRef.nativeElement, 'dt-table-column-align-center');
  _removeCssClass(elementRef.nativeElement, 'dt-table-column-align-right');
  _addCssClass(
    elementRef.nativeElement,
    `dt-table-column-align-${cssAlignmentClass}`,
  );
  _addCssClass(
    elementRef.nativeElement,
    `dt-table-column-${cssClassFriendlyName}`,
  );
}

/** @internal Set classes name and styles props for columns. */
export function _updateDtColumnStyles(
  columnDef: DtColumnDef,
  elementRef: ElementRef,
): void {
  _setDtColumnCssClasses(columnDef, elementRef);
  const element: HTMLElement = elementRef.nativeElement;
  if (element && element.style) {
    const { proportion, minWidth } = columnDef;
    const setProportion = coerceNumberProperty(proportion);
    if (setProportion > 0) {
      element.style.flexGrow = setProportion + '';
      element.style.flexShrink = setProportion + '';
    }
    const valueAndUnit = _parseCssValue(minWidth);
    if (valueAndUnit !== null) {
      element.style.minWidth = `${valueAndUnit.value}${valueAndUnit.unit}`;
    } else {
      element.style.minWidth = '';
    }
  }
}
