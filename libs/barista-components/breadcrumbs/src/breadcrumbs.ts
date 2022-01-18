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

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewEncapsulation,
  AfterViewInit,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  Inject,
  ChangeDetectorRef,
  ViewChild,
  NgZone,
} from '@angular/core';
import { Subject, merge, combineLatest } from 'rxjs';
import {
  startWith,
  takeUntil,
  map,
  distinctUntilChanged,
  filter,
} from 'rxjs/operators';

import {
  Constructor,
  mixinColor,
  _readKeyCode,
} from '@dynatrace/barista-components/core';

import { DtBreadcrumbsItem2 } from './breadcrumbs-item';
import { DomPortalOutlet, PortalOutlet, DomPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  Overlay,
  OverlayConfig,
  ConnectedPosition,
  OverlayRef,
} from '@angular/cdk/overlay';
import { determineOverflowingItems } from './overflowing-items';
import { ESCAPE, hasModifierKey, TAB } from '@angular/cdk/keycodes';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { findFirstFocusableItem } from './focusable-items';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any;

const COLLAPSED_BUTTON_WIDTH = 36;

const DT_BREADCRUMBS_OVERLAY_POSITIONS: ConnectedPosition[] = [
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
  },
];

export type DtBreadcrumbThemePalette = 'main' | 'error' | 'neutral';

// Boilerplate for applying mixins to DtBreadcrumb.
export class DtBreadcrumbBase {
  constructor(public _elementRef: ElementRef) {}
}

export const _DtBreadcrumbMixinBase = mixinColor<
  Constructor<DtBreadcrumbBase>,
  DtBreadcrumbThemePalette
>(DtBreadcrumbBase, 'main');
@Component({
  selector: 'dt-breadcrumbs',
  exportAs: 'dtBreadcrumbs',
  templateUrl: 'breadcrumbs.html',
  styleUrls: ['breadcrumbs.scss'],
  host: {
    class: 'dt-breadcrumbs',
    '[attr.aria-haspopup]': 'this._hasHiddenItems',
  },
  inputs: ['color'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtBreadcrumbs
  extends _DtBreadcrumbMixinBase
  implements AfterContentInit, AfterViewInit, OnDestroy
{
  @ContentChildren(DtBreadcrumbsItem2)
  private _items: QueryList<DtBreadcrumbsItem2>;

  _transplantedItemsString = ``;

  /** Observes the container size */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _containerSizeObserver: any;

  private _destroy$ = new Subject<void>();

  /** Observable that triggers when the container size changes */
  private _containerContentRect$ = new Subject<DOMRect>();

  /** Used to trigger focus handling when the overlay trigger is blurred */
  private _overlayTriggerKeydown$ = new Subject<KeyboardEvent>();

  /** Reference of the overlay containing transplanted breadcrumb items */
  private _overlayRef: OverlayRef | null = null;

  /** Map of portals holding each item that has been moved to the overlay */
  private _itemsPortalsMap = new Map<DtBreadcrumbsItem2, PortalOutlet>();

  /** Map containing the initial width of each breadcrumb item */
  private _itemsWidthMap = new Map<DtBreadcrumbsItem2, number>();

  /** Container holding transplanted breadcrumb items */
  private _collapsedContainer: HTMLDivElement | null = null;

  /** @internal Whether breadcrumbs are hidden */
  get _hasHiddenItems(): boolean {
    return this._items.length > 0 && this._itemsPortalsMap.size > 0;
  }

  /** Reference of the trigger toggling the overlay */
  @ViewChild('collapseTrigger', { static: false })
  private _trigger: ElementRef | null;

  constructor(
    public elementRef: ElementRef,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    private _injector: Injector,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Inject(DOCUMENT) private _document: any,
    private _overlay: Overlay,
    private _changeDetectorRef: ChangeDetectorRef,
    private _zone: NgZone,
  ) {
    super(elementRef);
    this._createCollapsedContainer();
  }

  ngAfterViewInit(): void {
    // If either the container rect or the breadcrumb items change
    // we have to check if items need to be moved to/from the overlay
    combineLatest([
      this._containerContentRect$,
      this._items.changes.pipe(startWith([])),
    ])
      .pipe(
        // No need to update if there are no items,
        // this is handled in the subscriber of the item changes
        filter(() => this._items.length > 0),
        // Determine items that need to be moved to the overlay
        map(([rect]) => {
          return this._determineItemsToTransplant(rect);
        }),
        // Don't do anything if the transplanted items did not change
        distinctUntilChanged((oldTransplantedItems, newTransplantedItems) => {
          if (oldTransplantedItems.length !== newTransplantedItems.length) {
            return false;
          }
          return oldTransplantedItems.every(
            (item, index) => newTransplantedItems[index] === item,
          );
        }),
        map((items) => {
          const toTransplant: DtBreadcrumbsItem2[] = [];
          const toPutBack: DtBreadcrumbsItem2[] = [];

          // If an item is not yet included in `_itemsPortalsMap`,
          // add the item to the map
          for (const item of items) {
            if (!this._itemsPortalsMap.has(item)) {
              toTransplant.push(item);
            }
          }

          // If an item is included in `_itemsPortalsMap`, but not in the list of items
          // to transplant, it needs to be put back into the breadcrumbs container
          for (const item of this._itemsPortalsMap.keys()) {
            if (!items.includes(item)) {
              toPutBack.push(item);
            }
          }

          return {
            toTransplant,
            toPutBack,
          };
        }),
        takeUntil(this._destroy$),
      )
      .subscribe(({ toTransplant, toPutBack }) => {
        // Create the overlay if items need to be transplanted
        if (toTransplant.length > 0) {
          this._createOverlay();
        }

        // Detach items from the overlay that have previously been moved
        // to the overlay, but fit in the breadcrumbs container again
        for (const item of toPutBack) {
          const portalOutlet = this._itemsPortalsMap.get(item);
          if (portalOutlet) {
            portalOutlet.detach();
          }
          this._itemsPortalsMap.delete(item);
        }

        // Create a DOM portal outlet for every item that needs to be
        // moved to the overlay and attach it to the portal outlet
        for (const item of toTransplant) {
          const portalOutlet = new DomPortalOutlet(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this._collapsedContainer!,
            this._componentFactoryResolver,
            this._appRef,
            this._injector,
            this._document,
          );
          portalOutlet.attach(new DomPortal(item._elementRef.nativeElement));
          this._itemsPortalsMap.set(item, portalOutlet);
        }

        // Set title of the toggle to contain all transplanted breadcrumb items
        this._transplantedItemsString = toTransplant
          .map((item) => item._elementRef.nativeElement.textContent)
          .join(` - `);

        // If no items are left in the overlay, dispose it
        if (this._itemsPortalsMap.size === 0) {
          this._overlayRef?.dispose();
          this._overlayRef = null;
        }

        // If only one item is left in the breadcrumbs container, set class for truncating the text
        if (this._itemsPortalsMap.size === this._items.length - 1) {
          this._items.last._setEllipsis(true);
        } else {
          this._items.last._setEllipsis(false);
        }

        if (toTransplant.length > 0 || toPutBack.length > 0) {
          // If items are transplanted or put back, mark the breadcrumbs dirty
          this._changeDetectorRef.markForCheck();
        }
      });

    if ('ResizeObserver' in window) {
      this._containerSizeObserver = new window.ResizeObserver((entries) => {
        if (entries && entries[0]) {
          // The next call needs to be run inside the zone otherwise
          // all code that is executed due to the emition would also run
          // outside zone. The resizeobserver is not something zone.js is listening
          // to.
          this._zone.run(() => {
            this._containerContentRect$.next(entries[0].contentRect);
          });
        }
      });

      this._containerSizeObserver.observe(this._elementRef.nativeElement);
    }
  }

  ngAfterContentInit(): void {
    this._items.changes
      .pipe(startWith(null), takeUntil(this._destroy$))
      .subscribe(() => {
        // If items change, reset everything to default
        this._itemsWidthMap.clear();

        if (this._itemsPortalsMap.size > 0) {
          // Move all transplanted items back from the overlay to the breadcrumbs
          // so that each item's width can be calculated correctly again
          this._itemsPortalsMap.forEach((item) => {
            item.detach();
          });

          this._itemsPortalsMap.clear();
          this._overlayRef?.detach();
          // Mark breadcrumbs dirty to correctly render the overlay toggle
          this._changeDetectorRef.markForCheck();
        }

        this._items.forEach((item, index) => {
          item._setEllipsis(false);
          // We need to notify the items whether they are the last one in the list,
          // because they use this information to determine their active state.
          item._setCurrent(this._items.length - 1 === index);
          this._itemsWidthMap.set(
            item,
            item._elementRef.nativeElement.getBoundingClientRect().width,
          );
        });
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    if (this._overlayRef) {
      this._overlayRef.dispose();
    }
  }

  closeOverlay(): void {
    this._overlayRef?.detach();
  }

  _createOverlay(): void {
    if (!this._overlayRef) {
      const overlayConfig: OverlayConfig = {
        positionStrategy: this._overlay
          .position()
          .flexibleConnectedTo(this._elementRef)
          .setOrigin(this._elementRef)
          .withPositions(DT_BREADCRUMBS_OVERLAY_POSITIONS),
        panelClass: 'dt-breadcrumbs-overlay',
      };
      this._overlayRef = this._overlay.create(overlayConfig);

      this._overlayRef
        ?.keydownEvents()
        .pipe(
          filter(
            (event: KeyboardEvent) =>
              _readKeyCode(event) === ESCAPE && !hasModifierKey(event),
          ),
        )
        .subscribe(() => {
          this.closeOverlay();
        });
    }
  }

  /** Toggles the overlay */
  _toggleOverlay(): void {
    if (this._overlayRef?.hasAttached()) {
      this.closeOverlay();
      this._collapsedContainer?.setAttribute(`aria-expanded`, `false`);
      return;
    }

    this._overlayRef?.attach(new DomPortal(this._collapsedContainer));
    this._collapsedContainer?.setAttribute(`aria-expanded`, `true`);
    const items = this._items.toArray().filter((item) => item._isFocusable);

    const keyManager = new ActiveDescendantKeyManager(items)
      .withWrap()
      .withVerticalOrientation();

    // Focus handling
    merge(
      ...items.map((item) => item._onKeyDown$),
      this._overlayTriggerKeydown$,
    ).subscribe((event) => {
      keyManager.onKeydown(event);

      if (_readKeyCode(event) === TAB) {
        const firstVisibleItem = this._getFirstVisibleFocusableItem();
        const firstTransplantedItem = this._getFirstTransplantedFocusableItem();
        const lastTransplantedItem = this._getLastTransplantedFocusableItem();

        if (hasModifierKey(event, `shiftKey`)) {
          // Focus the overlay toggle if the first item in the overlay is blurred
          if (
            event.target === firstTransplantedItem?._elementRef.nativeElement
          ) {
            event.preventDefault();
            this._trigger?.nativeElement.focus();
            return;
          }

          // Focus the last item in the overlay if the last visible is blurred and the overlay is open
          if (
            event.target === firstVisibleItem?._elementRef.nativeElement &&
            lastTransplantedItem
          ) {
            event.preventDefault();
            lastTransplantedItem._elementRef.nativeElement.focus();
            return;
          }

          return;
        }

        // Focus first focusable item in the overlay
        if (
          event.target === this._trigger?.nativeElement &&
          this._overlayRef?.hasAttached() &&
          firstTransplantedItem
        ) {
          event.preventDefault();
          firstTransplantedItem._elementRef.nativeElement.focus();
          return;
        }

        // Focus the next focusable item if the last item in the overlay is blurred
        if (event.target === lastTransplantedItem?._elementRef.nativeElement) {
          if (firstVisibleItem) {
            event.preventDefault();
            firstVisibleItem._elementRef.nativeElement.focus();
          } else {
            this._trigger?.nativeElement.focus();
          }

          return;
        }
      }
    });
  }

  /** @internal Nexts overlay trigger observable to trigger focus handling */
  _handleOverlayTriggerKeydown($event: KeyboardEvent): void {
    this._overlayTriggerKeydown$.next($event);
  }

  /**
   * Creates a container in the body that holds all breadcrumb items
   * This container is then moved into the overlay when the overlay is created
   */
  private _createCollapsedContainer(): void {
    if (!this._collapsedContainer) {
      const container = this._document.createElement('div');
      container.id = `dt-breadcrumb-collapsed-container`;
      container.setAttribute(`aria-expanded`, `false`);
      container.classList.add('dt-breadcrumb-collapsed-container');
      this._document.body.appendChild(container);
      this._collapsedContainer = container;
    }
  }

  /**
   * Returns an array of items that need to be moved to the overlay
   *
   * @param containerRect Bounds of the breadcrumbs container
   */
  private _determineItemsToTransplant(
    containerRect: DOMRect,
  ): DtBreadcrumbsItem2[] {
    return determineOverflowingItems(
      containerRect,
      this._itemsWidthMap,
      COLLAPSED_BUTTON_WIDTH,
    );
  }

  /** Returns the first focusable item of the breadcrumbs in the overlay */
  private _getFirstTransplantedFocusableItem(): DtBreadcrumbsItem2 | null {
    const focusableTransplantedItems = Array.from(
      this._itemsPortalsMap.keys(),
    ).filter((item) => item._isFocusable);
    return focusableTransplantedItems[0] || null;
  }

  /** Returns the last focusable item of the breadcrumbs in the overlay */
  private _getLastTransplantedFocusableItem(): DtBreadcrumbsItem2 | undefined {
    const transplantedItems = Array.from(
      this._itemsPortalsMap.keys(),
    ).reverse();

    return findFirstFocusableItem(transplantedItems);
  }

  /** Returns the first visible breadcrumb that is focusable */
  private _getFirstVisibleFocusableItem(): DtBreadcrumbsItem2 | undefined {
    const visibleItems = this._items
      .toArray()
      .slice(this._itemsPortalsMap.size);

    return findFirstFocusableItem(visibleItems);
  }
}
