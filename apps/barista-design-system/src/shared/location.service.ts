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

import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * CODE COPIED FROM: 'https://github.com/angular/angular/blob/master/aio/src/app/shared/location.service.ts' and modified
 */

@Injectable()
export class BaLocationService {
  // TODO: check if we have a document
  // tslint:disable-next-line ban
  private readonly _urlParser = document.createElement('a');
  private _urlSubject = new ReplaySubject<string>(1);

  private _currentUrl = this._urlSubject.pipe(
    map(url => this._stripSlashes(url)),
  );

  /** Emits when the current URL changes. */
  currentPath$: Observable<string> = this._currentUrl.pipe(
    map(url => (url.match(/[^?#]*/) || [])[0]), // strip query and hash
  );

  currentQuery$: Observable<URLSearchParams> = this._urlSubject.pipe(
    map(currentUrl =>
      currentUrl.includes('?')
        ? new URLSearchParams(currentUrl.split('?')[1])
        : new URLSearchParams(),
    ),
  );

  constructor(private _location: Location) {
    this._urlSubject.next(_location.path(true));
    this._location.subscribe(state => {
      this._urlSubject.next(state.url || '');
    });
  }

  /** Navigate to given URL. */
  go(url: string | null | undefined): void {
    if (!url) {
      return;
    }
    const urlWithoutSlashes = this._stripSlashes(url);
    if (/^http/.test(urlWithoutSlashes)) {
      // Has http protocol so leave the site
      this._goExternal(urlWithoutSlashes);
    } else {
      this._location.go(urlWithoutSlashes);
      this._urlSubject.next(urlWithoutSlashes);
    }
  }

  /**
   * Handle user's anchor click
   *
   * @param anchor - the anchor element clicked
   * @param button Number of the mouse button held down. 0 means left or none
   * @param ctrlKey True if control key held down
   * @param metaKey True if command or window key held down
   * @return false if service navigated with `go()`; true if browser should handle it.
   *
   * Since we are using `LocationService` to navigate between docs, without the browser
   * reloading the page, we must intercept clicks on links.
   * If the link is to a document that we will render, then we navigate using `Location.go()`
   * and tell the browser not to handle the event.
   *
   * In most apps you might do this in a `LinkDirective` attached to anchors but in this app
   * we have a special situation where the `DocViewerComponent` is displaying semi-static
   * content that cannot contain directives. So all the links in that content would not be
   * able to use such a `LinkDirective`. Instead we are adding a click handler to the
   * `AppComponent`, whose element contains all the of the application and so captures all
   * link clicks both inside and outside the `DocViewerComponent`.
   */

  handleAnchorClick(
    anchor: HTMLAnchorElement,
    button: number = 0,
    ctrlKey: boolean = false,
    metaKey: boolean = false,
  ): boolean {
    // Check for modifier keys and non-left-button, which indicate the user wants to control navigation
    if (button !== 0 || ctrlKey || metaKey) {
      return true;
    }

    // If there is a target and it is not `_self` then we take this
    // as a signal that it doesn't want to be intercepted.
    // TODO: should we also allow an explicit `_self` target to opt-out?
    const anchorTarget = anchor.target;
    if (anchorTarget && anchorTarget !== '_self') {
      return true;
    }

    if (anchor.getAttribute('download') !== null) {
      return true; // let the download happen
    }

    const { pathname, search, hash } = anchor;
    const relativeUrl = pathname + search + hash;
    this._urlParser.href = relativeUrl;

    // don't navigate if external link or has extension
    if (anchor.href !== this._urlParser.href || !/\/[^/.]*$/.test(pathname)) {
      return true;
    }

    // approved for navigation
    this.go(relativeUrl);
    return false;
  }

  private _goExternal(url: string): void {
    window.location.assign(url);
  }

  private _stripSlashes(url: string): string {
    return url.replace(/^\/+/, '').replace(/\/+(\?|#|$)/, '$1');
  }
}
