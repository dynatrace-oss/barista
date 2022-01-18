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
} from '@angular/core';
import { _toggleCssClass } from '@dynatrace/barista-components/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** The min-width from which empty state items are displayed horizontally. */
const ITEMS_HORIZONTAL_BREAKPOINT = 540;

/** The min-width from which the empty state items are aligned next to each other. */
const LAYOUT_HORIZONTAL_BREAKPOINT = 760;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any;

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
  selector: 'dt-empty-state-footer-actions, [dtEmptyStateFooterActions]',
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
  implements AfterContentInit, AfterViewInit, OnDestroy
{
  /** @internal Empty state items (1..n) */
  @ContentChildren(DtEmptyStateItem)
  _items: QueryList<DtEmptyStateItem>;

  private readonly _destroy$ = new Subject<void>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _containerSizeObserver: any;

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
    private _platform: Platform,
  ) {}

  ngAfterContentInit(): void {
    this._items.changes.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    if (this._platform.isBrowser) {
      // Check if the browser supports the resizeObserver.
      if ('ResizeObserver' in window) {
        this._containerSizeObserver = new window.ResizeObserver((entries) => {
          if (entries && entries[0]) {
            // We need to wrap the call to the layout update into an additional
            // requestAnimationFrame, because the resize observer would trow a
            // javascript error when it is not able to process all entries within
            // a single animation frame.
            // From the specification:
            // > This error means that ResizeObserver was not able to deliver all
            // > observations within a single animation frame. It is benign (your
            // > site will not break). - Aleksandar Totic
            // https://stackoverflow.com/a/50387233
            requestAnimationFrame(() => {
              this._updateLayoutForSize(entries[0].contentRect.width);
            });
          }
        });
        this._containerSizeObserver.observe(this._elementRef.nativeElement);
      }
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    if (this._containerSizeObserver) {
      this._containerSizeObserver.disconnect();
    }
  }

  /** Function that updates the layout based on the passed component width */
  private _updateLayoutForSize(componentWidth: number): void {
    const itemLayoutHorizontal = componentWidth > ITEMS_HORIZONTAL_BREAKPOINT;
    const layoutHorizontal =
      this._items?.length > 1 && componentWidth > LAYOUT_HORIZONTAL_BREAKPOINT;

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

/**
 * Marks a custom empty state component to be used within, for example, `<dt-table>`.
 * The custom empty state must both extend and provide itself as a DtEmptyState.
 */
@Directive({
  selector: '[dtCustomEmptyState]',
})
export class DtCustomEmptyState {}
