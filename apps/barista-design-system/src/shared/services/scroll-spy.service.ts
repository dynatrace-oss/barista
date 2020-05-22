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

export interface BaScrollItem {
  top?;
  element: Element;
}

@Injectable()
export class BaScrollSpyService {
  private _spyElements: BaScrollItem[] = [];
  private _onStopListening = new Subject<void>();
  private _lastContentHeight: number;
  private _lastMaxScrollTop: number;
  private _TOPOFFSET = 66;
  activeScrollItem: ReplaySubject<BaScrollItem | null> = new ReplaySubject(1);

  constructor(
    private _platform: Platform,
    @Inject(DOCUMENT) private _document: any,
  ) {}

  spyOn(elements: Element[]): Observable<BaScrollItem | null> {
    this._mapToSpyElementsFrom(elements);
    fromEvent(window, 'resize')
      .pipe(auditTime(300), takeUntil(this._onStopListening))
      .subscribe(() => {
        this._onResize();
      });
    fromEvent(window, 'scroll')
      .pipe(auditTime(10), takeUntil(this._onStopListening))
      .subscribe(() => {
        this._onScroll();
      });
    this._onResize();
    this._spyElements.forEach((_) => {
      this.onScroll(this._getScrollTop(), this._lastMaxScrollTop);
    });

    return this.activeScrollItem.asObservable().pipe(distinctUntilChanged());
  }

  private _onResize(): void {
    this._lastContentHeight = this._getContentHeight();
    this._lastMaxScrollTop =
      this._getContentHeight() - this._getViewportHeight();
    this._calculateTopOfSpyElements();
  }

  private _onScroll(): void {
    if (this._lastContentHeight !== this._getContentHeight()) {
      this._onResize();
    }

    this._spyElements.forEach((_) => {
      this.onScroll(this._getScrollTop(), this._lastMaxScrollTop);
    });
  }

  onScroll(scrollTop: number, maxScrollTop: number): void {
    let activeItem: BaScrollItem | undefined;
    if (scrollTop + 1 >= maxScrollTop) {
      activeItem = this._spyElements[0];
    } else {
      activeItem = this._spyElements.find((spiedElem) => {
        if (spiedElem.top <= scrollTop) {
          return true;
        }
        return false;
      });
    }
    // console.log(activeItem)
    this.activeScrollItem.next(activeItem || null);
  }

  private _mapToSpyElementsFrom(elements: Element[]): void {
    elements.map((element) => {
      this._spyElements.push({ element: element });
    });
  }
  private _calculateTopOfSpyElements(): void {
    this._spyElements.map((element) => {
      element.top = this._calculateTop(
        this._getScrollTop(),
        this._TOPOFFSET,
        element.element,
      );
    });
    this._spyElements.sort((a, b) => b.top - a.top);
  }

  private _getContentHeight(): number {
    return this._document.body.scrollHeight || Number.MAX_SAFE_INTEGER;
  }

  private _getScrollTop(): number {
    return (this._platform.isBrowser && window.pageYOffset) || 0;
  }

  private _getViewportHeight(): number {
    return (this._platform.isBrowser && window.innerHeight) || 0;
  }

  /**
   * Calculate the `top` value, i.e. the value of the `scrollTop` property at which this element
   * becomes active. The current implementation assumes that window is the scroll-container.
   */
  private _calculateTop(
    scrollTop: number,
    topOffset: number,
    element: Element,
  ): number {
    return scrollTop + element.getBoundingClientRect().top - topOffset;
  }

  /**
   * Calculate the `top` value of each ScrollSpiedElement of this group (based on te current
   * `scrollTop` and `topOffset` values), so that the active element can be later determined just by
   * comparing its `top` property with the then current `scrollTop`.
   */
  calibrate(scrollTop: number, topOffset: number): void {
    for (const spiedElem of this._spyElements) {
      spiedElem.top = this._calculateTop(
        scrollTop,
        topOffset,
        spiedElem.element,
      );
    }
    this._spyElements.sort((a, b) => b.top - a.top); // Sort in descending `top` order.
  }

  unspy(): void {
    this.activeScrollItem.complete();
    this._spyElements = [];
    if (!this._spyElements.length) {
      this._onStopListening.next();
    }
  }
}
