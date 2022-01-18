/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  DtFilterField,
  DtFilterFieldChangeEvent,
  DtFilterFieldCurrentFilterChangeEvent,
  DtFilterValue,
  isDtAutocompleteValue,
  _getSourcesOfDtFilterValues,
  isDtFreeTextValue,
  isDtRangeValue,
  TagParserFunction,
} from '@dynatrace/barista-components/filter-field';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { DtQuickFilterDataSource } from './quick-filter-data-source';
import {
  Action,
  addInitialFilters,
  isFilterChangeAction,
  setFilters,
  showGroupInDetailView,
  switchDataSource,
} from './state/actions';
import { quickFilterReducer } from './state/reducer';
import {
  getAutocompletes,
  getDataSource,
  getFilters,
  getInitialFilters,
  getIsDetailView,
} from './state/selectors';
import { createQuickFilterStore, QuickFilterState } from './state/store';
import { DtDrawer } from '@dynatrace/barista-components/drawer';
import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import {
  DtTriggerableViewportResizer,
  DtViewportResizer,
} from '@dynatrace/barista-components/core';
import { Platform } from '@angular/cdk/platform';

/** Directive that is used to place a title inside the quick filters sidebar */
@Directive({
  selector: 'dt-quick-filter-title, [dtQuickFilterTitle]',
  exportAs: 'dtQuickFilterTitle',
  host: {
    class: 'dt-quick-filter-title',
  },
})
export class DtQuickFilterTitle {}

/** Directive that is used to place a subtitle inside the quick filters sidebar */
@Directive({
  selector: 'dt-quick-filter-sub-title, [dtQuickFilterSubTitle]',
  exportAs: 'dtQuickFilterSubTitle',
  host: {
    class: 'dt-quick-filter-sub-title',
  },
})
export class DtQuickFilterSubTitle {}

/**
 * The `DtQuickFilterChangeEvent` is a class that is used to transport data.
 * It contains the added and removed filters as the current set of all filters.
 */
export class DtQuickFilterChangeEvent<T> extends DtFilterFieldChangeEvent<T> {}

/**
 * The `DtQuickFilterCurrentFilterChangeEvent` is a class that is used to transport data.
 * It contains the partially added or removed filters of the filter field.
 */
export class DtQuickFilterCurrentFilterChangeEvent<
  T,
> extends DtFilterFieldCurrentFilterChangeEvent<T> {}

@Component({
  selector: 'dt-quick-filter',
  exportAs: 'dtQuickFilter',
  templateUrl: 'quick-filter.html',
  styleUrls: ['quick-filter.scss'],
  host: {
    class: 'dt-quick-filter',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class DtQuickFilter<T = any> implements AfterViewInit, OnDestroy {
  /** Emits an event with the current value of the input field every time the user types. */
  @Output() readonly inputChange: Observable<string> = this._zone.onStable.pipe(
    take(1),
    switchMap(() => this._filterField.inputChange.asObservable()),
  );

  /** Emits when a new filter has been added or removed. */
  @Output() readonly filterChanges = new EventEmitter<
    DtQuickFilterChangeEvent<T>
  >();

  /** Emits when a part has been added to the currently active filter. */
  @Output() readonly currentFilterChanges: Observable<
    DtQuickFilterCurrentFilterChangeEvent<T>
  > = this._zone.onStable.pipe(
    take(1),
    switchMap(() => this._filterField.currentFilterChanges.asObservable()),
  );

  /**
   * Emits when the drawer open state changes.
   * Emits a boolean value for the open state (true for open, false for close).
   * Fires after the animation is completed.
   */
  @Output()
  readonly sidebarOpenChange: Observable<boolean> = this._zone.onStable.pipe(
    take(1),
    switchMap(() => this._drawer.openChange.asObservable()),
  );

  /**
   * @internal
   * Instance of the filter field that will be controlled by the quick filter
   */
  @ViewChild(DtFilterField, { static: true })
  _filterField: DtFilterField<T>;

  /**
   * @internal
   * Instance of the drawer that will be controlled by the quick filter
   */
  @ViewChild(DtDrawer, { static: true })
  _drawer: DtDrawer;

  /**
   * The sidebarOpened property toggles the sidebar open state.
   * By default the sidebar is set to be opened.
   */
  @Input()
  get sidebarOpened(): boolean {
    return this._sidebarOpened;
  }
  set sidebarOpened(value: boolean) {
    this._sidebarOpened = coerceBooleanProperty(value);
  }
  _sidebarOpened = true;
  static ngAcceptInputType_sidebarOpened: BooleanInput;

  /**
   * Label for the filter field (e.g. "Filter by").
   * Will be placed next to the filter icon in the filter field
   */
  @Input() label = '';

  /** Label for the "Clear all" button in the filter field (e.g. "Clear all"). */
  @Input() clearAllLabel = '';

  /** Set the Aria-Label attribute */
  @Input('aria-label') ariaLabel = '';

  /**
   * Template for the show more text of the group
   * The implicit context of the template is the count of the remaining items,
   * the view value can be accessed through the group variable
   *
   * @example
   * ```HTML
   * <ng-template #showMore let-count let-group="group">
   * </ng-template>
   * ```
   */
  @Input() showMoreTemplate: TemplateRef<{ $implicit: number; group: string }>;

  /** The data source instance that should be connected to the filter field. */
  @Input()
  get dataSource(): DtQuickFilterDataSource {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const dataSource = this._store.select(
      (state: BehaviorSubject<QuickFilterState>) => state.value.dataSource,
    )!;
    return dataSource;
  }
  set dataSource(dataSource: DtQuickFilterDataSource) {
    this._store.dispatch(switchDataSource(dataSource));
  }

  /** The currently applied filters */
  @Input()
  get filters(): T[][] {
    return this._filterField.filters;
  }
  set filters(filters: T[][]) {
    this._store.dispatch(addInitialFilters(filters));
  }

  /** A function to override the default or injected configuration for tag parsing */
  @Input()
  get customTagParser(): TagParserFunction | null {
    return this._filterField.customTagParser;
  }
  set customTagParser(value: TagParserFunction | null) {
    this._filterField.customTagParser = value;
  }

  /**
   * The aria-level of the group headlines for the document outline.
   */
  @Input() groupHeadlineRole = 3;

  /**
   * The maximum amount of items that should be displayed in the quick filter
   * sidebar. If there are more they are hidden behind a show more functionality
   */
  @Input() maxGroupItems = 5;

  /** Determines the loading state of the filter field */
  @Input() loading = false;

  /** The store where the data flow is managed */
  private _store = createQuickFilterStore(quickFilterReducer);

  /** @internal the autocomplete fields that should be rendered by the quick filter */
  readonly _autocompleteData$ = this._store.select(getAutocompletes);
  /** @internal the dataSource that gets passed to the filter field */
  readonly _filterFieldDataSource$ = this._store.select(getDataSource);
  /** @internal the list of all current active filters */
  readonly _activeFilters$ = this._store.select(getFilters);
  /** @internal If a show more detail page should be shown */
  readonly _isDetailView$ = this._store.select(getIsDetailView);
  /** @internal The height of the virtual scroll container */
  _virtualScrollHeight = 0;

  /** Subject that is used for bulk unsubscribing */
  private _destroy$ = new Subject<void>();

  constructor(
    private _zone: NgZone,
    private _elementRef: ElementRef<HTMLElement>,
    private _viewportResizer: DtViewportResizer,
    private _platform: Platform,
  ) {}

  /** Angular life-cycle hook that will be called after the view is initialized */
  ngAfterViewInit(): void {
    // Set the height for the virtual scroll container
    this._virtualScrollHeight = this._getVirtualScrollContainerHeight();
    // We need to wait for the first on stable call, otherwise the
    // underlying filter field will throw an expression changed after checked
    // error. Deferring the first filter setting.
    // Relates to a very weird and hard to reproduce bug described in
    // https://github.com/dynatrace-oss/barista/issues/1305
    const stable$ = this._zone.onStable.pipe(take(1));

    stable$
      .pipe(
        switchMap(() => this._activeFilters$),
        map((filters) =>
          filters.map((values) => _getSourcesOfDtFilterValues(values)),
        ),
        takeUntil(this._destroy$),
      )
      .subscribe((filters) => {
        this._filterField.filters = filters;
      });

    stable$
      .pipe(
        switchMap(() => this._store.select(getInitialFilters)),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filter<any[][]>(Boolean),
        takeUntil(this._destroy$),
      )
      .subscribe((filters) => {
        this._filterField.filters = filters;
        this._store.dispatch(setFilters(this._getFilteredValues()));
      });
  }

  /** Angular life-cycle hook that will be called on component destroy */
  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Opens the sidebar if it is not already opened.
   */
  openSidebar(): void {
    this.toggleSidebar(true);
  }

  /**
   * Closes the sidebar if it is not already closed.
   */
  closeSidebar(): void {
    this.toggleSidebar(false);
  }

  /**
   * Toggles the open state of the sidebar.
   *
   * @param sidebarOpened the state the drawer should be toggled to – `'open' | 'close'`
   * Default the opposite of the current open state.
   */
  toggleSidebar(sidebarOpened: boolean = !this.sidebarOpened): void {
    this._sidebarOpened = sidebarOpened;
  }

  /** @internal Closes the detail view and shows all groups */
  _goBackFromDetail(): void {
    this._store.dispatch(showGroupInDetailView(undefined));
  }

  /**
   * @internal
   * When the user selects an option in the quick filter an action gets passed
   * to this function that will be dispatched to the store
   */
  _changeFilter(action: Action): void {
    this._virtualScrollHeight = this._getVirtualScrollContainerHeight();
    this._store.dispatch(action);
    if (isFilterChangeAction(action)) {
      this.filterChanges.emit(
        new DtQuickFilterChangeEvent(
          this._filterField,
          [],
          [],
          this._filterField.filters,
        ),
      );
    }
  }

  /** @internal Bubble the filter field change event through */
  _filterFieldChanged(change: DtFilterFieldChangeEvent<T>): void {
    // Filter only autocomplete filters as we don't use free-text and range in the quick-filter
    this._store.dispatch(setFilters(this._getFilteredValues()));
    this.filterChanges.emit(change);
  }

  _onOpenChange(_event: boolean): void {
    if (this._viewportResizer instanceof DtTriggerableViewportResizer) {
      (<DtTriggerableViewportResizer>this._viewportResizer).trigger();
    }
  }

  /** Get the filter Values from the Filter Field with only the displayable autocompletes */
  private _getFilteredValues(): DtFilterValue[][] {
    return this._filterField._filterValues.filter((group) =>
      group.every(
        (value) =>
          isDtAutocompleteValue(value) ||
          isDtFreeTextValue(value) ||
          isDtRangeValue(value),
      ),
    );
  }

  /** Get the height for the virtual scroll container */
  private _getVirtualScrollContainerHeight(): number {
    const groups: HTMLElement[] =
      [].slice.call(
        this._elementRef.nativeElement.querySelectorAll(
          '.dt-quick-filter-group',
        ),
      ) || [];

    if (this._platform.isBrowser) {
      return (
        groups.reduce(
          (height, group) => (height += group.getBoundingClientRect().height),
          0,
        ) - 28
      ); // the 28 is the height of a group headline;
    }

    return 0;
  }
}
