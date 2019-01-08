import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  Input,
  Renderer2,
  ViewEncapsulation,
  ContentChildren,
  QueryList,
  Optional,
  SkipSelf,
  ChangeDetectorRef,
} from '@angular/core';
import { CdkCellDef, CdkColumnDef, CdkHeaderCellDef } from '@angular/cdk/table';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { DtRow } from './row';
import { Subject, merge, Subscription } from 'rxjs';
import { isDefined, addCssClass, DtIndicator } from '@dynatrace/angular-components/core';
import { switchMap, filter, takeUntil, startWith, map } from 'rxjs/operators';
import { DtSort, DtSortEvent } from './sort/sort';

/** Custom Types for Cell alignments */
export type DtTableColumnAlign = 'left' | 'right' | 'center';
export type DtTableColumnTypedAlign = 'text' | 'id' | 'icon' | 'control' | 'number' | 'date' | 'ip';

/**
 * Cell definition for the dt-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
@Directive({
  selector: '[dtCellDef]',
  providers: [{provide: CdkCellDef, useExisting: DtCellDef}],
})
export class DtCellDef extends CdkCellDef { }

/**
 * Header cell definition for the dt-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[dtHeaderCellDef]',
  providers: [{provide: CdkHeaderCellDef, useExisting: DtHeaderCellDef}],
})
export class DtHeaderCellDef extends CdkHeaderCellDef { }

/**
 * Column definition for the dt-table.
 * Defines a set of cells available for a table column.
 */
@Directive({
  selector: '[dtColumnDef]',
  providers: [{provide: CdkColumnDef, useExisting: DtColumnDef}],
})
export class DtColumnDef extends CdkColumnDef {
  /** Unique name for this column. */
  // tslint:disable-next-line:no-input-rename
  @Input('dtColumnDef') name: string;
  // tslint:disable-next-line:no-input-rename
  @Input('dtColumnAlign') align: DtTableColumnTypedAlign | DtTableColumnAlign;
  // tslint:disable-next-line:no-input-rename
  @Input('dtColumnProportion') proportion: number;
  // tslint:disable-next-line:no-input-rename
  @Input('dtColumnMinWidth') minWidth: string | number;
}

/** Header cell template container that adds the right classes and role. */
@Directive({
  selector: 'dt-header-cell',
  host: {
    class: 'dt-header-cell',
    role: 'columnheader',
  },
  exportAs: 'dtHeaderCell',
})
export class DtHeaderCell {
  // tslint:disable-next-line:no-unused-variable
  constructor(columnDef: DtColumnDef, renderer: Renderer2, elem: ElementRef) {
    updateColumnStyles(columnDef, elem, renderer);
  }
}

type IndicatorType = 'error' | 'warning';

/** Cell template container that adds the right classes and role. */
@Component({
  selector: 'dt-cell',
  template: '<ng-content></ng-content>',
  styleUrls: ['./scss/cell.scss'],
  host: {
    'class': 'dt-cell',
    'role': 'gridcell',
    '[class.dt-cell-sorted]': '_isSorted',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtCell',
})
export class DtCell {
  @ContentChildren(DtIndicator, { descendants: true }) _indicators: QueryList<DtIndicator>;

  /** Whether the cell has an error */
  get hasError(): boolean { return this._hasIndicator('error'); }

  /** Whether the cell has a warning */
  get hasWarning(): boolean { return this._hasIndicator('warning'); }

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

  // tslint:disable-next-line:no-unused-variable
  constructor(
    public _columnDef: DtColumnDef,
    public _cDRef: ChangeDetectorRef,
    renderer: Renderer2,
    elem: ElementRef,
    @Optional() @SkipSelf() dtSortable: DtSort
  ) {

    if (dtSortable) {
      this._sortChangeSubscription = dtSortable.sortChange.subscribe((sort: DtSortEvent) => {
        this._isSorted = sort.active === this._columnDef.name;
        this._cDRef.detectChanges();
      });
    }

    updateColumnStyles(this._columnDef, elem, renderer);
    if (DtRow.mostRecentRow) {
      this._row = DtRow.mostRecentRow;
      this._row._registerCell(this);
    }
  }

  ngAfterContentInit(): void {
    this._indicators.changes.pipe(takeUntil(this._destroy)).subscribe(() => { this._stateChanges.next(); });

    // Emits whenever one of the indicator's inputs changes
    this._indicators.changes.pipe(
      startWith(null),
      takeUntil(this._destroy),
      filter(() => !!this._indicators.length),
      switchMap(() => merge(...this._indicators.map((indicator) => indicator._stateChanges))))
    .subscribe(() => { this._stateChanges.next(); });

    Promise.resolve().then(() => { this._stateChanges.next(); });
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();
    this._sortChangeSubscription.unsubscribe();
    if (this._row) {
      this._row._unregisterCell(this);
    }
  }

  private _hasIndicator(indicatorType: IndicatorType): boolean {
    return this._indicators && isDefined(this._indicators
      .find((indicator) => indicator.active && indicator.color === indicatorType));
  }
}

/**
 * Cell template that adds the right classes, role and static content for the details cell,
 * which can be used to indicate that a table row is expandable.
 */
@Component({
  selector: 'dt-expandable-cell',
  template: '<dt-icon class="dt-expandable-cell-dropdown" name="dropdownopen"></dt-icon>',
  styleUrls: ['./scss/expandable-cell.scss'],
  host: {
    class: 'dt-expandable-cell',
    role: 'gridcell',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtExpandableCell',
})
export class DtExpandableCell extends DtCell {}

const ALIGNMENT_CAST_MAP = new Map<DtTableColumnTypedAlign, DtTableColumnAlign>([
  ['icon', 'center'],
  ['control', 'center'],
  ['number', 'right'],
  ['date', 'right'],
  ['ip', 'right'],
]);

/**
 * Maps the provided alignment to a css align provided by the cast map, if there's no coincidence
 * return the provided one. In the latter case will be handle with the default left-aligned SCSS style.
 *
 * This will be also 'type checked' with the Template Compiler feature from @Angular6.
 */
function coerceAlignment(value: DtTableColumnAlign | DtTableColumnTypedAlign): DtTableColumnAlign {
  return ALIGNMENT_CAST_MAP.get(value as DtTableColumnTypedAlign) || value as DtTableColumnAlign;
}

/** Set classes name and styles props for columns. */
function updateColumnStyles(columnDef: DtColumnDef, elem: ElementRef, renderer: Renderer2): void {
  const { align, proportion, minWidth, cssClassFriendlyName } = columnDef;
  const { nativeElement } = elem;
  const cssAlignmentClass = coerceAlignment(align);

  addCssClass(nativeElement, `dt-table-column-${cssClassFriendlyName}`, renderer);
  addCssClass(nativeElement, `dt-table-column-align-${cssAlignmentClass}`, renderer);

  const setProportion = coerceNumberProperty(proportion);
  if (setProportion > 0) {
    renderer.setStyle(nativeElement, 'flex-grow', setProportion);
    renderer.setStyle(nativeElement, 'flex-shrink', setProportion);
  }
  if (minWidth > 0) {
    renderer.setStyle(nativeElement, 'min-width', `${coerceNumberProperty(minWidth)}px`);
  }
}
