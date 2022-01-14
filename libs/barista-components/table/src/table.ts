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

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Inject,
  Input,
  IterableDiffers,
  NgZone,
  OnDestroy,
  Optional,
  QueryList,
  SkipSelf,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { Subject, Subscription, BehaviorSubject } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { DtEmptyState } from '@dynatrace/barista-components/empty-state';

import { _DtTableBase } from './base-table';
import {
  DtSimpleColumnComparatorFunction,
  DtSimpleColumnDisplayAccessorFunction,
  DtSimpleColumnSortAccessorFunction,
} from './simple-columns/simple-column-base';
import {
  _DisposeViewRepeaterStrategy,
  _ViewRepeater,
  _VIEW_REPEATER_STRATEGY,
} from '@angular/cdk/collections';
import {
  RenderRow,
  RowContext,
  StickyPositioningListener,
  STICKY_POSITIONING_LISTENER,
  _CoalescedStyleScheduler,
  _COALESCED_STYLE_SCHEDULER,
} from '@angular/cdk/table';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { DtTableSelection } from './selection/selection';

interface SimpleColumnsAccessorMaps<T> {
  displayAccessorMap: Map<string, DtSimpleColumnDisplayAccessorFunction<T>>;
  sortAccessorMap: Map<string, DtSimpleColumnSortAccessorFunction<T>>;
  comparatorMap: Map<string, DtSimpleColumnComparatorFunction<T>>;
}

let nextUniqueId = 0;
@Component({
  selector: 'dt-table',
  styleUrls: ['./table.scss'],
  templateUrl: './table.html',
  exportAs: 'dtTable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  host: {
    class: 'dt-table',
    '[class.dt-table-interactive-rows]': 'interactiveRows',
    '[class.dt-table-expandable-rows]': '_hasExpandableRows',
  },
  providers: [
    { provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler },
    {
      provide: _VIEW_REPEATER_STRATEGY,
      useClass: _DisposeViewRepeaterStrategy,
    },
  ],
})
export class DtTable<T> extends _DtTableBase<T> implements OnDestroy {
  private _multiExpand: boolean; // TODO: discuss default value with UX, should maybe change from false to true
  private _loading: boolean;
  private _destroy$ = new Subject<void>();
  private _showExportButton: boolean = false; //Revert to opt-in instead of opt-out per request

  /** Sort accessor map that holds all sort accessor functions from the registered simple columns. */
  private _sortAccessorMap = new Map<
    string,
    DtSimpleColumnSortAccessorFunction<T>
  >();
  /** Sort accessor map that holds all display accessor functions from the registered simple columns. */
  private _displayAccessorMap = new Map<
    string,
    DtSimpleColumnDisplayAccessorFunction<T>
  >();
  /** Sort accessor map that holds all comparator accessor functions from the registered simple columns. */
  private _comparatorFunctionMap = new Map<
    string,
    DtSimpleColumnComparatorFunction<T>
  >();

  /** @internal A generated UID */
  _uniqueId = `dt-table-${nextUniqueId++}`;

  /** @internal Whether a expandable row is registered with the table */
  _hasExpandableRows = false;

  /** @internal Reference to filteredData in table-data-source */
  _filteredData: T[];

  /** @internal Reference to exportable data. */
  _exporter: {
    filteredData: T[];
    selection: DtTableSelection<T> | null;
  };

  /** @internal Determine if selection is enabled and properly connected. */
  get _selectionEnabledAndConnected(): boolean {
    if (this._exporter && this._exporter.selection) return true;
    else return false;
  }

  /** The number of rows that have been selected by the user. */
  get numSelectedRows(): number {
    if (
      this._exporter &&
      this._exporter.selection != null &&
      this._exporter.selection.selected
    )
      return this._exporter.selection.selected.length;
    else return 0;
  }

  /** Whether the loading state should be displayed. */
  @Input()
  get loading(): boolean {
    return this._loading;
  }
  set loading(value: boolean) {
    this._loading = coerceBooleanProperty(value);
  }

  /** Whether multiple rows can be expanded at a time. */
  @Input()
  get multiExpand(): boolean {
    return this._multiExpand;
  }
  set multiExpand(value: boolean) {
    this._multiExpand = coerceBooleanProperty(value);
  }

  /** Whether the datasource is empty. */
  get isEmptyDataSource(): boolean {
    return !(this._data && this._data.length);
  }

  /**
   * Experimental!
   * Opt-in to the possibility to export all table data, visible table data or
   * selected table data into a csv file.
   */
  @Input()
  get showExportButton(): boolean {
    return this._showExportButton;
  }
  set showExportButton(value: boolean) {
    this._showExportButton = coerceBooleanProperty(value);
  }
  static ngAcceptInputType_showExportButton: BooleanInput;

  /** @internal The snapshot of the current data */
  get _dataSnapshot(): T[] | readonly T[] {
    return this._data;
  }

  /** @internal The QueryList that holds the empty state component */
  @ContentChildren(DtEmptyState) _emptyState: QueryList<DtEmptyState>;

  /** @internal The template where the empty state component gets rendered inside */
  @ViewChild('emptyStateTemplate', { static: true })
  _emptyStateTemplate: TemplateRef<DtEmptyState>;

  /** @internal The portal where the component will be projected in when we have to show the empty state. */
  @ViewChild(CdkPortalOutlet, { static: true })
  _portalOutlet: CdkPortalOutlet;

  /** @internal Stream of all simple dataAccessor functions for all SimpleColumns */
  _dataAccessors = new BehaviorSubject<SimpleColumnsAccessorMaps<T>>({
    displayAccessorMap: this._displayAccessorMap,
    sortAccessorMap: this._sortAccessorMap,
    comparatorMap: this._comparatorFunctionMap,
  });

  /** Updates the dataAccessors subject for the connected datasource. */
  private _updateAccessors(): void {
    this._dataAccessors.next({
      displayAccessorMap: this._displayAccessorMap,
      sortAccessorMap: this._sortAccessorMap,
      comparatorMap: this._comparatorFunctionMap,
    });
  }

  /** Subscription of attached stream of the portal outlet  */
  private _portalOutletSubscription = Subscription.EMPTY;

  constructor(
    differs: IterableDiffers,
    changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef,
    @Attribute('role') role: string,
    // tslint:disable-next-line: no-any
    @Inject(DOCUMENT) document: any,
    platform: Platform,
    private _viewContainerRef: ViewContainerRef,
    @Inject(_VIEW_REPEATER_STRATEGY)
    _viewRepeater: _ViewRepeater<T, RenderRow<T>, RowContext<T>>,
    @Inject(_COALESCED_STYLE_SCHEDULER)
    _coalescedStyleScheduler: _CoalescedStyleScheduler,
    _viewportRuler: ViewportRuler,
    @Optional()
    @SkipSelf()
    @Inject(STICKY_POSITIONING_LISTENER)
    _stickyPositioningListener: StickyPositioningListener,
    @Optional() protected readonly _ngZone: NgZone,
  ) {
    super(
      differs,
      changeDetectorRef,
      elementRef,
      document,
      platform,
      _viewRepeater,
      _coalescedStyleScheduler,
      _viewportRuler,
      role,
      _stickyPositioningListener,
      _ngZone,
    );
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this._destroy$.next();
    this._destroy$.complete();
    this._portalOutletSubscription.unsubscribe();
  }

  /**
   * Renders rows based on the table's latest set of data,
   * which was either provided directly as an input or retrieved
   * through an Observable stream (directly or from a DataSource).
   */
  renderRows(): void {
    // To prevent an error that was thrown when the the component containing
    // the table was destroyed. `"Cannot move a destroyed View in a ViewContainer!"`
    //
    // This check is necessary because the cdkTable does not check
    // if the view is already destroyed before moving it
    // https://github.com/angular/components/blob/c68791db9a0b4107d04fa924c27a087cd00a8989/src/cdk/table/table.ts#L637
    //
    // The dependency for the _rowOutlet internal is safe, as we already
    // depend on this one for the template as well.
    const rowOutletViewContainer = this._rowOutlet.viewContainer;
    let shouldRender = false;

    // Figure out if all views within the viewContainer are already
    // destroyed.
    for (let i = 0; i < rowOutletViewContainer.length; i += 1) {
      const view = rowOutletViewContainer.get(i);
      if (view!.destroyed === false) {
        shouldRender = true;
        break;
      }
    }

    // Only if not all view containers have been destroyed, or if
    // there are no viewContainers at all.
    if (shouldRender || rowOutletViewContainer.length === 0) {
      super.renderRows();
    }

    // no need if there is no empty state provided via content projection
    if (!this._emptyState.first) {
      return;
    }

    // if we have a subscription we need to unsubscribe to re-subscribe later on
    // we need to subscribe in this function in case that there is no other hook
    // where we can hook into the cdk Table
    if (this._portalOutletSubscription) {
      this._portalOutletSubscription.unsubscribe();
    }

    this._portalOutletSubscription = this._portalOutlet.attached
      .pipe(mapTo(this._emptyState.first))
      .subscribe((emptyState) => {
        // Update the layout of the empty state after it was attached
        emptyState._visible = true;
      });

    if (this.isEmptyDataSource) {
      if (!this._portalOutlet.hasAttached()) {
        const template = new TemplatePortal(
          this._emptyStateTemplate,
          this._viewContainerRef,
        );
        this._portalOutlet.attachTemplatePortal(template);
      }
      this._emptyState.first._visible = true;
      this._changeDetectorRef.markForCheck();
    } else {
      // ned to unset the visibility to have every time the component will be attached a fading animation.
      this._emptyState.first._visible = false;
      this._portalOutlet.detach();
    }
  }

  /** Update the column accessor functions  */
  _updateColumnAccessors(
    name: string,
    displayAccessor?: DtSimpleColumnDisplayAccessorFunction<T>,
    sortAccessor?: DtSimpleColumnSortAccessorFunction<T>,
    comparatorFunction?: DtSimpleColumnComparatorFunction<T>,
  ): void {
    if (displayAccessor) {
      this._displayAccessorMap.set(name, displayAccessor);
    } else {
      this._displayAccessorMap.delete(name);
    }
    if (sortAccessor) {
      this._sortAccessorMap.set(name, sortAccessor);
    } else {
      this._sortAccessorMap.delete(name);
    }
    if (comparatorFunction) {
      this._comparatorFunctionMap.set(name, comparatorFunction);
    } else {
      this._comparatorFunctionMap.delete(name);
    }
    this._updateAccessors();
  }

  /** @internal Helper function for simple columns to unregister their sort accessors. */
  _removeColumnAccessors(name: string): void {
    this._sortAccessorMap.delete(name);
    this._displayAccessorMap.delete(name);
    this._comparatorFunctionMap.delete(name);
    this._updateAccessors();
  }

  /** CSS class added to any row or cell that has sticky positioning applied. */
  protected stickyCssClass = 'dt-table-sticky';

  /** @internal Exports the filtered source data from the dataSource. */
  // Note: this is different from the display text, see instead _exportDisplayData().
  _exportFilteredData(): void {
    const exportData = this._filteredData;
    if (this.isEmptyDataSource || typeof exportData[0] != 'object') {
      return;
    }

    const csvObj = { csv: '' };
    const keys: string[] = Object.keys(exportData[0]);

    if (!keys.length) {
      return;
    }

    //check for objects, expand properties into new columns
    for (let i = keys.length - 1; i > -1; i--) {
      const key = keys[i];
      const val = exportData[0][key];
      if (typeof val == 'object') {
        const subkeys = Object.keys(val).map((sk) => `${key}.${sk}`);
        keys.splice(i, 1, ...subkeys);
      }
    }
    // header row
    csvObj.csv += keys.join(',') + '\n';

    for (const row of exportData) {
      for (let idx = 0; idx < keys.length; idx++) {
        const key = keys[idx];
        let val: any;
        if (key.includes('.') && typeof row[key] == 'undefined') {
          //derived key object.property
          const keyArr = key.split('.');
          const objKey = keyArr[0];
          const prop = keyArr[1];
          const obj = row[objKey] || {};
          val = obj[prop];
        } else {
          val = row[key];
        }
        this._appendValToCSV(csvObj, val, idx, keys.length);
      }
      csvObj.csv += '\n';
    }
    this._downloadCSV(csvObj.csv);
  }

  /** @internal Exports the filtered display data from the dataSource after being formatted by a displayAccessor. */
  _exportDisplayData(exportData: T[] = this._filteredData): void {
    if (this.isEmptyDataSource || typeof exportData[0] != 'object') {
      return;
    }

    const csvObj = { csv: '' };
    const keys: string[] = [...this._contentHeaderRowDefs.first.columns].filter(
      (h: string) => h !== 'checkbox',
    );
    //skip selection column
    if (!keys.length) {
      return;
    }

    //get column names
    const headerList = this._elementRef.nativeElement.querySelectorAll(
      'dt-header-row dt-header-cell',
    );
    const headersArr = Array.from(headerList);
    const headers = headersArr
      .map((h: HTMLElement): String => {
        const txt = h.innerText;
        if (txt.includes(',')) return `"${txt}"`;
        else return txt;
      })
      .filter((h: string) => h !== '');

    //skip selection column
    if (headers.length !== keys.length) {
      console.warn(
        '_exportDisplayData: mismatched column count. Data may be shifted.',
      );
    }

    // header row
    csvObj.csv += headers.join(',') + '\n';

    for (const row of exportData) {
      for (let idx = 0; idx < keys.length; idx++) {
        const key = keys[idx];
        const accessor = this._displayAccessorMap.get(key);
        const val = accessor ? accessor(row, key) : row[key];
        this._appendValToCSV(csvObj, val, idx, keys.length);
      }
      csvObj.csv += '\n';
    }

    this._downloadCSV(csvObj.csv);
  }

  /** Assemble the CSV while safely handling types. */
  private _appendValToCSV(
    csvObj: { csv: string },
    val: any,
    idx: number,
    len: number,
  ): void {
    switch (typeof val) {
      case 'string':
        break;
      case 'object': //if it's still complex, just convert to JSON and move on
        val = JSON.stringify(val);
        break;
      case 'undefined':
        val = '';
        break;
      default:
        val = val.toString();
    }

    if (val.includes(',')) {
      val = val.replace(/"/g, '""'); //escape any existing double quotes
      csvObj.csv += `"${val}"`; //
    } else {
      csvObj.csv += val;
    }
    if (idx < len) {
      csvObj.csv += ',';
    }
  }

  /** @internal Export only the rows which are currently selected. */
  _exportSelection(): void {
    if (this._exporter.selection) {
      this._exportDisplayData(this._exporter.selection.selected);
    } else {
      console.log('no selection');
    }
  }

  /** Take a CSV string and trigger a download in browser */
  private _downloadCSV(csv: string): void {
    //make csv document
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = 'table-' + new Date().getTime() + '.csv';
    link.click();
    link.remove();
  }
}
