import { coerceNumberProperty } from '@angular/cdk/coercion';
import { CdkCellDef, CdkColumnDef } from '@angular/cdk/table';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  QueryList,
  Renderer2,
  SkipSelf,
  ViewEncapsulation,
} from '@angular/core';
import { Subject, Subscription, merge } from 'rxjs';
import { filter, startWith, switchMap, takeUntil } from 'rxjs/operators';

import {
  DtIndicator,
  addCssClass,
  isDefined,
  parseCssValue,
  removeCssClass,
} from '@dynatrace/angular-components/core';

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
  // tslint:disable-next-line:no-input-rename
  @Input('dtColumnDef') name: string;
  // tslint:disable-next-line:no-input-rename
  @Input('dtColumnAlign') align: DtTableColumnTypedAlign | DtTableColumnAlign =
    'left';
  // tslint:disable-next-line:no-input-rename
  @Input('dtColumnProportion') proportion: number;
  // TODO: Consider switching to ngStyle syntax in the future - value.unit
  // tslint:disable-next-line:no-input-rename
  @Input('dtColumnMinWidth') minWidth: string | number;

  /** @internal Alignment subject which fires with changes to the alignment input. */
  _stateChanges = new Subject<void>();

  ngOnChanges(): void {
    this._stateChanges.next();
  }
}

type IndicatorType = 'error' | 'warning';

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
  @ContentChildren(DtIndicator, { descendants: true }) _indicators: QueryList<
    DtIndicator
  >;

  /** Whether the cell has an error */
  get hasError(): boolean {
    return this._hasIndicator('error');
  }

  /** Whether the cell has a warning */
  get hasWarning(): boolean {
    return this._hasIndicator('warning');
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
    renderer: Renderer2,
    elem: ElementRef,
    @Optional() @SkipSelf() dtSortable?: DtSort,
  ) {
    if (dtSortable) {
      this._isSorted = dtSortable.active === this._columnDef.name;
      dtSortable.sortChange
        .pipe(takeUntil(this._destroy))
        .subscribe((sort: DtSortEvent) => {
          // If event is void, it is being unregisterd.
          this._isSorted = sort.active === this._columnDef.name;
          this._changeDetectorRef.detectChanges();
        });
    }

    this._columnDef._stateChanges
      .pipe(
        startWith(null),
        takeUntil(this._destroy),
      )
      .subscribe(() => {
        _updateDtColumnStyles(this._columnDef, elem, renderer);
      });

    if (DtRow.mostRecentRow) {
      this._row = DtRow.mostRecentRow;
      this._row._registerCell(this);
    }
  }

  ngAfterContentInit(): void {
    this._indicators.changes.pipe(takeUntil(this._destroy)).subscribe(() => {
      this._stateChanges.next();
    });

    // Emits whenever one of the indicator's inputs changes
    this._indicators.changes
      .pipe(
        startWith(null),
        takeUntil(this._destroy),
        filter(() => !!this._indicators.length),
        switchMap(() =>
          merge(...this._indicators.map(indicator => indicator._stateChanges)),
        ),
      )
      .subscribe(() => {
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
    return (
      this._indicators &&
      isDefined(
        this._indicators.find(
          indicator => indicator.active && indicator.color === indicatorType,
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

  removeCssClass(elementRef.nativeElement, 'dt-table-column-align-left');
  removeCssClass(elementRef.nativeElement, 'dt-table-column-align-center');
  removeCssClass(elementRef.nativeElement, 'dt-table-column-align-right');
  addCssClass(
    elementRef.nativeElement,
    `dt-table-column-align-${cssAlignmentClass}`,
  );
  addCssClass(
    elementRef.nativeElement,
    `dt-table-column-${cssClassFriendlyName}`,
  );
}

/** @internal Set classes name and styles props for columns. */
export function _updateDtColumnStyles(
  columnDef: DtColumnDef,
  elementRef: ElementRef,
  renderer: Renderer2,
): void {
  _setDtColumnCssClasses(columnDef, elementRef);
  const { proportion, minWidth } = columnDef;
  const setProportion = coerceNumberProperty(proportion);
  if (setProportion > 0) {
    renderer.setStyle(elementRef.nativeElement, 'flex-grow', setProportion);
    renderer.setStyle(elementRef.nativeElement, 'flex-shrink', setProportion);
  }
  const valueAndUnit = parseCssValue(minWidth);
  if (valueAndUnit !== null) {
    renderer.setStyle(
      elementRef.nativeElement,
      'min-width',
      `${valueAndUnit.value}${valueAndUnit.unit}`,
    );
  } else {
    renderer.removeStyle(elementRef.nativeElement, 'min-width');
  }
}
