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

import { coerceBooleanProperty } from '@angular/cdk/coercion';
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
  OnDestroy,
  QueryList,
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
})
export class DtTable<T> extends _DtTableBase<T> implements OnDestroy {
  private _multiExpand: boolean; // TODO: discuss default value with UX, should maybe change from false to true
  private _loading: boolean;
  private _destroy$ = new Subject<void>();

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
  ) {
    super(differs, changeDetectorRef, elementRef, document, platform, role);
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
    super.renderRows();

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
}
