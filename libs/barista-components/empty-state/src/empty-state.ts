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

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Platform } from '@angular/cdk/platform';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import {
  DtViewportResizer,
  _toggleCssClass,
} from '@dynatrace/barista-components/core';

/** The min-width from which empty state items are displayed horizontally. */
const ITEMS_HORIZONTAL_BREAKPOINT = 540;

/** The min-width from which the empty state items are aligned next to each other. */
const LAYOUT_HORIZONTAL_BREAKPOINT = 760;

/**
 * An empty state item. An empty state card may contain one or more such items.
 *
 * @example
 *   <dt-empty-state-item>
 *     <dt-empty-state-item-img>
 *      <img src="asset.png" alt="asset"/>
 *     </dt-empty-state-item-img>
 *     <dt-empty-state-item-title>optional heading</dt-empty-state-item-title>
 *     some item description
 *   </dt-empty-state-item>
 */
@Component({
  selector: 'dt-empty-state-item',
  templateUrl: 'empty-state-item.html',
  styleUrls: ['empty-state-item.scss'],
  host: {
    class: 'dt-empty-state-item',
  },
})
export class DtEmptyStateItem {}

/**
 * The image of an empty state card item.
 *
 * @example
 *   <dt-empty-state-item-img>
 *     <img src="asset.png" alt="asset"/>
 *   </dt-empty-state-item-img>
 */
@Directive({
  selector:
    'dt-empty-state-item-img, [dt-empty-state-item-img], [dtEmptyStateItemImg]',
  exportAs: 'dtEmptyStateItemImg',
  host: {
    class: 'dt-empty-state-item-img',
    'aria-hidden': 'true',
  },
})
export class DtEmptyStateItemImage {}

/**
 * The (optional) heading of an empty state card item.
 *
 * @example <dt-empty-state-item-title>optional heading</dt-empty-state-item-title>
 */
@Directive({
  selector:
    'dt-empty-state-item-title, [dt-empty-state-item-title], [dtEmptyStateItemTitle]',
  exportAs: 'dtEmptyStateItemTitle',
  host: {
    class: 'dt-empty-state-item-title',
    role: 'heading',
  },
})
export class DtEmptyStateItemTitle {}

/**
 * The action button/s that is/are placed below the image and text of the item
 * (must be a cta styled primary button).
 *
 * @example
 *   <dt-empty-state-footer-actions>
 *     <a dt-button color="cta" i18n>View release</a>
 *     <a dt-button color="cta" i18n>More info</a>
 *   </dt-empty-state-footer-actions>
 */
@Directive({
  selector: 'dt-empty-state-footer-actions',
  host: {
    class: 'dt-empty-state-footer-actions',
  },
})
export class DtEmptyStateFooterActions {}

/**
 * Placeholder for content that does not yet exist. It consists of one or more
 * items with each item containing an image, an optional header and a
 * short description text. It can be used within a `<dt-card>` or
 * an `<dt-table>`.
 */
@Component({
  selector: 'dt-empty-state',
  exportAs: 'dtEmptyState',
  template: '<ng-content></ng-content>',
  styleUrls: ['empty-state.scss'],
  host: {
    class: 'dt-empty-state',
    '[@fadeIn]': '_visibility',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  animations: [
    trigger('fadeIn', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class DtEmptyState
  implements AfterContentInit, AfterViewInit, OnDestroy {
  /** @internal Empty state items (1..n) */
  @ContentChildren(DtEmptyStateItem)
  _items: QueryList<DtEmptyStateItem>;

  private readonly _destroy$ = new Subject<void>();

  /**
   * @internal
   * Whether empty state items should have a horizontal layout
   * (i.e. image and text next to each other).
   */
  _isItemLayoutHorizontal = false;

  /**
   * @internal
   * Whether empty state items should be aligned next to each other.
   */
  _isLayoutHorizontal = false;

  /** @internal set the visible state to trigger a fade animation */
  set _visible(visibility: boolean) {
    this._visibility = visibility ? 'visible' : 'hidden';
  }

  /** @internal The visibility state that is used to trigger the animation steps */
  _visibility: 'visible' | 'hidden' = 'visible';

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>,
    private _viewportResizer: DtViewportResizer,
    private _platform: Platform,
  ) {}

  ngAfterContentInit(): void {
    this._items.changes.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    this._viewportResizer
      .change()
      .pipe(startWith(null), takeUntil(this._destroy$))
      .subscribe(() => {
        this._updateLayout();
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** @internal Updates the layout according to the width of the container (horizontal or vertical) */
  _updateLayout(): void {
    if (this._platform.isBrowser) {
      const componentWidth = this._elementRef.nativeElement.getBoundingClientRect()
        .width;

      const itemLayoutHorizontal = componentWidth > ITEMS_HORIZONTAL_BREAKPOINT;
      const layoutHorizontal =
        this._items?.length > 1 &&
        componentWidth > LAYOUT_HORIZONTAL_BREAKPOINT;

      _toggleCssClass(
        layoutHorizontal,
        this._elementRef.nativeElement,
        'dt-empty-state-layout-horizontal',
      );
      _toggleCssClass(
        itemLayoutHorizontal && !layoutHorizontal,
        this._elementRef.nativeElement,
        'dt-empty-state-items-horizontal',
      );
    }
  }
}

/**
 * Empty state base class that needs to be implemented by every custom
 * empty state that is used inside the table. It provides a proxy to the updateLayout
 * function of the empty state that will be called by the table.
 */
export class DtCustomEmptyStateBase {
  /** @internal Finds the empty state inside the component */
  @ViewChild(DtEmptyState) _emptyState: DtEmptyState;

  /**
   * @internal
   * Proxies the update layout function of the empty state
   * to react to layout changes.
   */
  _updateLayout(): void {
    // If we have an empty state proxy the updateLayout function
    this._emptyState?._updateLayout();
  }
}

/**
 * Marks a custom empty state component to be used within, for example, `<dt-table>`.
 * The custom empty state must both extend and provide itself as a DtEmptyState.
 */
@Directive({
  selector: '[dtCustomEmptyState]',
})
export class DtCustomEmptyState {}
