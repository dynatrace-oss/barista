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

import { Component, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { Subscription, fromEvent, interval } from 'rxjs';
import { throttle, pairwise, map, startWith } from 'rxjs/operators';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'button[ba-scroll-to-top]',
  templateUrl: 'scroll-to-top.html',
  styleUrls: ['scroll-to-top.scss'],
  host: {
    class: 'ba-scroll-top-button',
    '[class.ba-scroll-top-button-show]': '_showScrollToTop',
    '(click)': '_scrollToTop()',
  },
})
export class BaScrollToTop implements AfterViewInit, OnDestroy {
  /** @internal */
  _showScrollToTop = false;

  /** Subscription on scrolling */
  private _scrollSubscription = Subscription.EMPTY;

  private _throttleInterval = 200;

  /** the threshold for the scroll position, before which the scroll to top button is not displayed */
  private _threshold = 150;

  constructor(private _zone: NgZone, private _platform: Platform) {}

  ngAfterViewInit(): void {
    if (!this._platform.isBrowser) {
      return;
    }

    this._zone.runOutsideAngular(() => {
      this._scrollSubscription = fromEvent(window, 'scroll')
        .pipe(
          startWith(null),
          throttle(() => interval(this._throttleInterval), { trailing: true }),
          map(() => (window ? window.scrollY : 0)),
          pairwise(),
          map(
            ([lastScrollPosition, currentScrollPosition]) =>
              currentScrollPosition < lastScrollPosition &&
              currentScrollPosition >= this._threshold,
          ),
        )
        .subscribe((isVisible) => {
          // Only update the value if it has changed.
          if (isVisible !== this._showScrollToTop) {
            this._zone.run(() => {
              this._showScrollToTop = isVisible;
            });
          }
        });
    });
  }

  ngOnDestroy(): void {
    this._scrollSubscription.unsubscribe();
  }

  _scrollToTop(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
