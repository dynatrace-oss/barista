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

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject, fromEvent } from 'rxjs';
import { auditTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

/**
 * CODE COPIED FROM: 'https://github.com/angular/angular/blob/master/aio/src/app/shared/scroll-spy.service.ts' and modified
 */

export interface BaScrollItem {
  element: Element;
  index: number;
}

export interface BaScrollSpyInfo {
  active: Observable<BaScrollItem | null>;
  unspy(): void;
}

/*
 * Represents a "scroll-spied" element. Contains info and methods for determining whether this
 * element is the active one (i.e. whether it has been scrolled passed), based on the window's
 * scroll position.
 */
export class BaScrollSpiedElement implements BaScrollItem {
  top = 0;

  constructor(readonly element: Element, readonly index: number) {}

  /*
   * Calculate the `top` value, i.e. the value of the `scrollTop` property at which this element
   * becomes active. The current implementation assumes that window is the scroll-container.
   */
  calculateTop(scrollTop: number, topOffset: number): void {
    this.top = scrollTop + this.element.getBoundingClientRect().top - topOffset;
  }
}

/*
 * Represents a group of "scroll-spied" elements. Contains info and methods for efficiently
 * determining which element should be considered "active", i.e. which element has been scrolled
 * passed the top of the viewport.
 */
export class BaScrollSpiedElementGroup {
  activeScrollItem: ReplaySubject<BaScrollItem | null> = new ReplaySubject(1);
  private _spiedElements: BaScrollSpiedElement[];

  constructor(elements: Element[]) {
    this._spiedElements = elements.map(
      (elem, i) => new BaScrollSpiedElement(elem, i),
    );
  }

  /*
   * Caclulate the `top` value of each ScrollSpiedElement of this group (based on te current
   * `scrollTop` and `topOffset` values), so that the active element can be later determined just by
   * comparing its `top` property with the then current `scrollTop`.
   */
  calibrate(scrollTop: number, topOffset: number): void {
    for (const spiedElem of this._spiedElements) {
      spiedElem.calculateTop(scrollTop, topOffset);
    }
    this._spiedElements.sort((a, b) => b.top - a.top); // Sort in descending `top` order.
  }

  /*
   * Determine which element is the currently active one, i.e. the lower-most element that is
   * scrolled passed the top of the viewport (taking offsets into account) and emit it on
   * `activeScrollItem`.
   * If no element can be considered active, `null` is emitted instead.
   * If window is scrolled all the way to the bottom, then the lower-most element is considered
   * active even if it not scrolled passed the top of the viewport.
   */
  onScroll(scrollTop: number, maxScrollTop: number): void {
    let activeItem: BaScrollItem | undefined;
    if (scrollTop + 1 >= maxScrollTop) {
      activeItem = this._spiedElements[0];
    } else {
      activeItem = this._spiedElements.find(spiedElem => {
        if (spiedElem.top <= scrollTop) {
          return true;
        }
        return false;
      });
    }

    this.activeScrollItem.next(activeItem || null);
  }
}

@Injectable()
export class BaScrollSpyService {
  private _spiedElementGroups: BaScrollSpiedElementGroup[] = [];
  private _onStopListening = new Subject<void>();
  private _resizeEvents = fromEvent(window, 'resize').pipe(
    // tslint:disable-next-line: no-magic-numbers
    auditTime(300),
    takeUntil(this._onStopListening),
  );
  private _scrollEvents = fromEvent(window, 'scroll').pipe(
    // tslint:disable-next-line: no-magic-numbers
    auditTime(10),
    takeUntil(this._onStopListening),
  );
  private _lastContentHeight: number;
  private _lastMaxScrollTop: number;
  private _topOffset = 66;

  // tslint:disable-next-line: no-any
  constructor(@Inject(DOCUMENT) private _doc: any) {}

  /*
   * Start tracking a group of elements and emitting active elements; i.e. elements that are
   * currently visible in the viewport. If there was no other group being spied, start listening for
   * `resize` and `scroll` events.
   */
  spyOn(elements: Element[]): BaScrollSpyInfo {
    if (!this._spiedElementGroups.length) {
      this._resizeEvents.subscribe(() => {
        this._onResize();
      });
      this._scrollEvents.subscribe(() => {
        this._onScroll();
      });
      this._onResize();
    }

    const scrollTop = this._getScrollTop();
    const maxScrollTop = this._lastMaxScrollTop;

    const spiedGroup = new BaScrollSpiedElementGroup(elements);
    spiedGroup.calibrate(scrollTop, this._topOffset);
    spiedGroup.onScroll(scrollTop, maxScrollTop);

    this._spiedElementGroups.push(spiedGroup);

    return {
      active: spiedGroup.activeScrollItem
        .asObservable()
        .pipe(distinctUntilChanged()),
      unspy: () => {
        this._unspy(spiedGroup);
      },
    };
  }

  private _getContentHeight(): number {
    return this._doc.body.scrollHeight || Number.MAX_SAFE_INTEGER;
  }

  private _getScrollTop(): number {
    return (window && window.pageYOffset) || 0;
  }

  private _getViewportHeight(): number {
    return window.innerHeight;
  }

  /*
   * The size of the window has changed. Re-calculate all affected values,
   * so that active elements can be determined efficiently on scroll.
   */
  private _onResize(): void {
    const contentHeight = this._getContentHeight();
    const viewportHeight = this._getViewportHeight();
    const scrollTop = this._getScrollTop();

    this._lastContentHeight = contentHeight;
    this._lastMaxScrollTop = contentHeight - viewportHeight;

    for (const group of this._spiedElementGroups) {
      group.calibrate(scrollTop, this._topOffset);
    }
  }

  /*
   * Determine which element for each ScrollSpiedElementGroup is active. If the content height has
   * changed since last check, re-calculate all affected values first.
   */
  private _onScroll(): void {
    if (this._lastContentHeight !== this._getContentHeight()) {
      // Something has caused the scroll height to change.
      // (E.g. image downloaded, accordion expanded/collapsed etc.)
      this._onResize();
    }

    const scrollTop = this._getScrollTop();
    const maxScrollTop = this._lastMaxScrollTop;

    for (const group of this._spiedElementGroups) {
      group.onScroll(scrollTop, maxScrollTop);
    }
  }

  /*
   * Stop tracking this group of elements and emitting active elements. If there is no other group
   * being spied, stop listening for `resize` or `scroll` events.
   */
  private _unspy(spiedGroup: BaScrollSpiedElementGroup): void {
    spiedGroup.activeScrollItem.complete();
    this._spiedElementGroups = this._spiedElementGroups.filter(
      group => group !== spiedGroup,
    );

    if (!this._spiedElementGroups.length) {
      this._onStopListening.next();
    }
  }
}
