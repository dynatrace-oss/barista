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

import { Injectable, Inject, NgZone } from '@angular/core';
import { fromEvent, merge, Observable, of } from 'rxjs';
import {
  auditTime,
  take,
  map,
  withLatestFrom,
  startWith,
} from 'rxjs/operators';
import { Platform } from '@angular/cdk/platform';
import { compareValues } from '@dynatrace/barista-components/core';
import { DOCUMENT } from '@angular/common';

/** Contains boundingclientrect top property and element. Used to check which item is active */
interface HeadlineElement {
  top: number;
  element: Element;
}

/**
 * The Scroll spy service should get the elements from outside, then check wich element is
 * currently active and should be highlighted.
 * Save that item into a stream and the toc component then subscribes to it.
 * The TOC component then handles the check which item to highlight
 */
@Injectable()
export class BaScrollSpyService {
  constructor(
    private _platform: Platform,
    private _zone: NgZone,
    @Inject(DOCUMENT) private _document: any,
  ) {}

  /** Start spying on an element array of headlines returning a stream with the active item */
  spyOn(elements: Element[]): Observable<string | null> {
    if (this._platform.isBrowser) {
      const headlines$ = this._zone.onStable.pipe(
        take(1),
        map(() => {
          return this._calculateTopValues(elements);
        }),
      );
      // Resize and Scroll trigger event calculates top values and active item.
      return merge(
        fromEvent(window, 'resize').pipe(auditTime(300)),
        fromEvent(window, 'scroll').pipe(auditTime(50)),
      ).pipe(
        startWith(null),
        withLatestFrom(headlines$),
        map(([_ev, ele]) => this._findActiveItemId(ele)),
      );
    }
    return of(null);
  }

  /** Calculates top bounding properties for an element array */
  private _calculateTopValues(elements: Element[]): HeadlineElement[] {
    /**
     * The offset from the top of the viewport that triggers an toc item to be active
     * This enables us to have an item becoming active although its not on the very top of the viewport
     * e.g. Space below sectioncontents
     */
    const ACTIVE_ITEM_TOP_OFFSET = 80;
    return elements
      .map((element) => ({
        top:
          this._getScrollTop() +
          element.getBoundingClientRect().top -
          ACTIVE_ITEM_TOP_OFFSET,
        element,
      }))
      .sort((a, b) => compareValues(a.top, b.top, 'asc'))
      .reverse(); // Easier loop over elements to find the active item.
  }

  /**
   * Evaluates by comparing the users scroll position with the element top property and return the id of an element
   * that should be highlighted
   */
  private _findActiveItemId(elements: HeadlineElement[]): string | null {
    // The element id of the item to be highlighted
    let activeItemId: string | null = null;
    const scrollTop = this._getScrollTop();
    const contentHeight = this._getContentHeight();
    const viewportHeight = this._getViewportHeight();
    let i = 0;
    while (activeItemId === null && i < elements.length) {
      if (elements[i].top <= scrollTop) {
        // Check whether an elements top value is smaller then the users scroll top position and offset
        // resulting in setting that value as `active`
        activeItemId = elements[i].element.id;
      } else if (scrollTop + viewportHeight >= contentHeight) {
        // Special case when user is at the bottom of the page and there's no way tthe last item will be active
        activeItemId = elements[0].element.id;
      }
      i++;
    }
    return activeItemId;
  }

  /** Current position of user in Browser */
  private _getScrollTop(): number {
    return (this._platform.isBrowser && window.pageYOffset) || 0;
  }

  /** Height of the whole content */
  private _getContentHeight(): number {
    return this._document.body.scrollHeight || Number.MAX_SAFE_INTEGER;
  }

  /** Height of the viewport */
  private _getViewportHeight(): number {
    return (this._platform.isBrowser && window.innerHeight) || 0;
  }
}
