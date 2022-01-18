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

import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { ElementRef, Injectable } from '@angular/core';
import { Observable, Subject, merge } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

interface ViewportRect {
  top: number;
  left: number;
  bottom: number;
  right: number;
  height: number;
  width: number;
}

@Injectable({ providedIn: 'root' })
export class Viewport {
  private _refresher = new Subject<undefined | Element | ElementRef>();

  constructor(
    private _scrollDispatcher: ScrollDispatcher,
    private _viewportRuler: ViewportRuler,
  ) {}

  /**
   * Stream that emits the ClientRect for the
   * viewport's bounds on every change (includes scroll)
   */
  change(): Observable<ViewportRect> {
    return this._change();
  }

  /** Recalculates the elements' visibility states and emit to corresponding streams */
  refresh(el?: Element | ElementRef): void {
    this._refresher.next(el);
  }

  /** Stream that emits when the element enters or leaves the viewport */
  elementVisibility(el: Element | ElementRef): Observable<boolean> {
    const element = asElement(el);
    return this._change(element).pipe(
      map((viewportRect) => isElementVisible(element, viewportRect)),
      distinctUntilChanged(),
    );
  }

  /** Stream that emits when the element enters the viewport */
  elementEnter(el: Element | ElementRef): Observable<void> {
    return this.elementVisibility(el)
      .pipe(filter((visibility) => visibility))
      .pipe(map(() => void 0));
  }

  /** Stream that emits when the element leaves the viewport */
  elementLeave(el: Element | ElementRef): Observable<void> {
    return this.elementVisibility(el)
      .pipe(filter((visibility) => !visibility))
      .pipe(map(() => void 0));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _change(context?: any): Observable<ViewportRect> {
    return merge(
      this._scrollDispatcher.scrolled(),
      this._viewportRuler.change(200),
      this._refresher.pipe(
        filter((ctx) => !ctx || asElement(context) === asElement(ctx)),
      ),
    ).pipe(map(() => this._viewportRuler.getViewportRect()));
  }
}

/** Calculates if the element is visible in the viewports Client Rect */
export function isElementVisible(
  element: Element,
  viewportRect: ViewportRect,
): boolean {
  const { bottom, top } = element.getBoundingClientRect();
  return bottom >= 0 && top <= viewportRect.height;
}

function asElement(el: Element | ElementRef): Element {
  return el instanceof ElementRef ? el.nativeElement : el;
}
