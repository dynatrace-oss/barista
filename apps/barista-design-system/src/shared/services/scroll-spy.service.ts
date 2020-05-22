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

import { Injectable, Inject } from '@angular/core';
import { Subject, Observable, fromEvent, ReplaySubject } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { auditTime, takeUntil, distinctUntilChanged } from 'rxjs/operators';

/**
 * CODE COPIED FROM: 'https://github.com/angular/angular/blob/master/aio/src/app/shared/scroll-spy.service.ts' and modified
 */

/** Contains a spyable element and its boundingclientrect top value */
export interface BaScrollItem {
  top?;
  element: Element;
}

@Injectable()
export class BaScrollSpyService {
  /** Array of spyable elements with corresponding top value */
  private _spiedElements: BaScrollItem[] = [];
  /** Unsubscribes from resize and scroll events */
  private _onStopListening = new Subject<void>();
  /** Content height after resize and scroll events */
  private _lastContentHeight: number;
  /** Last possible scroll top position  */
  private _lastMaxScrollTop: number;
  /** Top offset constant  */
  private _TOPOFFSET = 66;
  /** Currently active scroll item */
  activeScrollItem: ReplaySubject<BaScrollItem | null> = new ReplaySubject(1);

  constructor(
    private _platform: Platform,
    @Inject(DOCUMENT) private _document: any,
  ) {}

  /**
   * @internal Start tracking a group of elements and emitting active elements; i.e. elements that are
   * currently visible in the viewport. If there was no other group being spied, start listening for
   * `resize` and `scroll` events.
   */
  spyOn(elements: Element[]): Observable<BaScrollItem | null> {
    this._mapToSpiedElementsFrom(elements);
    fromEvent(window, 'resize')
      .pipe(auditTime(300), takeUntil(this._onStopListening))
      .subscribe(() => {
        this._onResize();
      });
    fromEvent(window, 'scroll')
      .pipe(auditTime(10), takeUntil(this._onStopListening))
      .subscribe(() => {
        this._onScrollEvent();
      });
    this._onResize();
    this._spiedElements.forEach((_) => {
      this._onScroll(this._getScrollTop(), this._lastMaxScrollTop);
    });

    return this.activeScrollItem.asObservable().pipe(distinctUntilChanged());
  }

  /**
   * Stop tracking this group of elements and emitting active elements. If there is no other group
   * being spied, stop listening for `resize` or `scroll` events.
   */
  unspy(): void {
    this.activeScrollItem.complete();
    this._spiedElements = [];
    if (!this._spiedElements.length) {
      this._onStopListening.next();
    }
  }

  /**
   * @internal The size of the window has changed. Re-calculate all affected values,
   * so that active elements can be determined efficiently on scroll.
   */
  private _onResize(): void {
    this._lastContentHeight = this._getContentHeight();
    this._lastMaxScrollTop =
      this._getContentHeight() - this._getViewportHeight();
    this._calculateTopOfSpyElements();
  }

  /**
   * @internal Determine which element for each ScrollSpiedElementGroup is active. If the content height has
   * changed since last check, re-calculate all affected values first.
   */
  private _onScrollEvent(): void {
    if (this._lastContentHeight !== this._getContentHeight()) {
      this._onResize();
    }

    this._spiedElements.forEach((_) => {
      this._onScroll(this._getScrollTop(), this._lastMaxScrollTop);
    });
  }

  /**
   * @internal Determine which element is the currently active one, i.e. the lower-most element that is
   * scrolled passed the top of the viewport (taking offsets into account) and emit it on
   * `activeScrollItem`.
   * If no element can be considered active, `null` is emitted instead.
   * If window is scrolled all the way to the bottom, then the lower-most element is considered
   * active even if it not scrolled passed the top of the viewport.
   */
  private _onScroll(scrollTop: number, maxScrollTop: number): void {
    let activeItem: BaScrollItem | undefined;
    if (scrollTop + 1 >= maxScrollTop) {
      activeItem = this._spiedElements[0];
    } else {
      activeItem = this._spiedElements.find((spiedElem) => {
        if (spiedElem.top <= scrollTop) {
          return true;
        }
        return false;
      });
    }
    this.activeScrollItem.next(activeItem || null);
  }

  /** @internal Map spyable elements to BaScrollItem. Adds a `top` property to each element */
  private _mapToSpiedElementsFrom(elements: Element[]): void {
    elements.map((element) => {
      this._spiedElements.push({ element: element });
    });
  }

  /** @internal Evaluates each elements `top` property */
  private _calculateTopOfSpyElements(): void {
    this._spiedElements.map((element) => {
      element.top = this._calculateTop(
        this._getScrollTop(),
        this._TOPOFFSET,
        element.element,
      );
    });
    this._spiedElements.sort((a, b) => b.top - a.top);
  }

  /** @internal Get documents scroll height */
  private _getContentHeight(): number {
    return this._document.body.scrollHeight || Number.MAX_SAFE_INTEGER;
  }

  /** @internal Get current top value of viewport */
  private _getScrollTop(): number {
    return (this._platform.isBrowser && window.pageYOffset) || 0;
  }

  /** @internal Get viewport height */
  private _getViewportHeight(): number {
    return (this._platform.isBrowser && window.innerHeight) || 0;
  }

  /**
   * @internal Calculate the `top` value, i.e. the value of the `scrollTop` property at which this element
   * becomes active. The current implementation assumes that window is the scroll-container.
   */
  private _calculateTop(
    scrollTop: number,
    topOffset: number,
    element: Element,
  ): number {
    return scrollTop + element.getBoundingClientRect().top - topOffset;
  }
}
