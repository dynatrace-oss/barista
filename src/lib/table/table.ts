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
  NgZone,
  OnDestroy,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, Subject, Subscription, defer } from 'rxjs';
import {
  map,
  mapTo,
  startWith,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';

import { isDefined } from '@dynatrace/angular-components/core';
import { DtEmptyState } from '@dynatrace/angular-components/empty-state';

import { _DtTableBase } from './base-table';
import {
  DtSimpleColumnBase,
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
  moduleId: module.id,
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
  },
})
export class DtTable<T> extends _DtTableBase<T> implements OnDestroy {
  private _multiExpand: boolean; // TODO: discuss default value with UX, should maybe change from false to true
  private _loading: boolean;
  private _destroy$ = new Subject<void>();

  /** @internal A generated UID */
  _uniqueId = `dt-table-${nextUniqueId++}`;

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

  /** @internal List of all simpleColumns within the table. */
  @ContentChildren(DtSimpleColumnBase) _simpleColumns: QueryList<
    DtSimpleColumnBase<any> // tslint:disable-line:no-any
  >;

  /** @internal The QueryList that holds the empty state component */
  @ContentChildren(DtEmptyState) _emptyState: QueryList<DtEmptyState>;

  /** @internal The template where the empty state component gets rendered inside */
  @ViewChild('emptyStateTemplate', { static: true })
  _emptyStateTemplate: TemplateRef<DtEmptyState>;

  /** @internal The portal where the component will be projected in when we have to show the empty state. */
  @ViewChild(CdkPortalOutlet, { static: true })
  _portalOutlet: CdkPortalOutlet;

  /** @internal Stream of all simple dataAccessor functions for all SimpleColumns */
  readonly _dataAccessors: Observable<SimpleColumnsAccessorMaps<T>> = defer(
    () => {
      if (this._simpleColumns) {
        return this._simpleColumns.changes.pipe(
          takeUntil(this._destroy$),
          startWith(null),
          map(() => {
            const simpleColumnsArray = this._simpleColumns.toArray();
            /*
             * Map to a simpleColumns array, filter out all without an accessor function;
             * then create a map of accessor functions.
             */
            const displayAccessorMap = new Map<
              string,
              DtSimpleColumnDisplayAccessorFunction<T>
            >();
            simpleColumnsArray
              .filter(sc => isDefined(sc.displayAccessor))
              .forEach(sc =>
                displayAccessorMap.set(sc.name, sc.displayAccessor),
              );

            /*
             * Map to a simpleColumns array, filter out all without an accessor function;
             * then create a map of accessor functions.
             */
            const sortAccessorMap = new Map<
              string,
              DtSimpleColumnSortAccessorFunction<T>
            >();
            simpleColumnsArray
              .filter(sc => isDefined(sc.sortAccessor))
              .forEach(sc => sortAccessorMap.set(sc.name, sc.sortAccessor));

            const comparatorMap = new Map<
              string,
              DtSimpleColumnComparatorFunction<T>
            >();
            simpleColumnsArray
              .filter(sc => isDefined(sc.comparator))
              .forEach(sc => comparatorMap.set(sc.name, sc.comparator));

            return { displayAccessorMap, sortAccessorMap, comparatorMap };
          }),
        );
      }
      return this._ngZone.onStable.asObservable().pipe(
        take(1),
        switchMap(() => this._dataAccessors),
      );
    },
  );

  /** Subscription of attached stream of the portal outlet  */
  private _portalOutletSubscription = Subscription.EMPTY;

  constructor(
    differs: IterableDiffers,
    changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef,
    @Attribute('role') role: string,
    private _ngZone: NgZone,
    // tslint:disable-next-line: no-any
    @Inject(DOCUMENT) document: any,
    platform: Platform,
    private _viewContainerRef: ViewContainerRef,
  ) {
    super(differs, changeDetectorRef, elementRef, document, platform, role);
  }

  ngOnDestroy(): void {
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
      .subscribe(emptyState => {
        // Update the layout of the empty state after it was attached
        emptyState._updateLayout();
        emptyState._visible = true;
      });

    if (this.isEmptyDataSource && !this._portalOutlet.hasAttached()) {
      const template = new TemplatePortal(
        this._emptyStateTemplate,
        this._viewContainerRef,
      );
      this._portalOutlet.attachTemplatePortal(template);
    } else {
      // ned to unset the visibility to have every time the component will be attached a fading animation.
      this._emptyState.first._visible = false;
      this._portalOutlet.detach();
    }
  }
  /** CSS class added to any row or cell that has sticky positioning applied. */
  protected stickyCssClass = 'dt-table-sticky';
}
