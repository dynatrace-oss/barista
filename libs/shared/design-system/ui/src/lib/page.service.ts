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

import { DOCUMENT, APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import {
  BaErrorPageContent,
  BaPageLayoutType,
} from '@dynatrace/shared/design-system/interfaces';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

const ERROR_PAGE_404: BaErrorPageContent = {
  title: 'Error 404',
  layout: BaPageLayoutType.Error,
  content:
    'Sorry, the page you tried to access does not exist. Are you using an outdated link?',
};

const ERROR_PAGE: BaErrorPageContent = {
  title: 'Oops!',
  layout: BaPageLayoutType.Error,
  content:
    "Sorry, an error has occurred. Don't worry, we're working to fix the problem!",
};

@Injectable()
export class DsPageService<T = any> {
  /** Caches pages once they have been loaded. */
  _cache = new Map<string, T>();

  /** Base href of the application */
  private _baseHref: string;

  constructor(
    private _http: HttpClient,
    private _router: Router,
    @Inject(DOCUMENT) private _document: any,
    @Optional() @Inject(APP_BASE_HREF) _baseHref: string,
  ) {
    this._cache.set('not-found', ERROR_PAGE as any);
    this._cache.set('404', ERROR_PAGE_404 as any);
    this._baseHref = _baseHref || '';
  }

  /** Retrieves the current page based on the current route */
  _getCurrentPage(): T | null {
    const key = getPageKeyFromUrl(this._document, this._router.url);
    const page = this._cache.get(key);

    if (!page) {
      this._router.navigate(['not-found']);
      return null;
    }
    return page;
  }

  /**
   * Gets page from cache.
   *
   * @param url - path to page
   */
  _getPage(url: string): Observable<T> {
    const key = getPageKeyFromUrl(this._document, url);

    if (!this._cache.has(key)) {
      return this._fetchPage(key);
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return of(this._cache.get(key)!);
  }

  /**
   * Provides an array of categories for the Design System as an observable.
   */
  getCategories(): Observable<string[]> {
    const requestPath = `${this._baseHref}/data/categories.json`;

    return this._http.get<string[]>(requestPath, {
      responseType: 'json',
    });
  }

  /**
   * Fetches page from data source.
   *
   * @param id - page id (path).
   */
  private _fetchPage(id: string): Observable<T> {
    const requestPath = `${this._baseHref}/data/${id}.json`;
    return this._http
      .get<T>(requestPath, { responseType: 'json' })
      .pipe(tap((data) => this._cache.set(id, data)));
  }
}

/** Provides the cache key for a url */
export function getPageKeyFromUrl(document: Document, url: string): string {
  // remove the leading slash if there is one
  const key = getUrlPathName(document, url);
  return !key.length ? 'index' : key;
}

/**
 * Normalizes a url and removes hashes and parameters,
 * returns the current pathname
 *
 * @param document - the document used for creating an element
 * @param url - the url where the path should be retrieved
 */
export function getUrlPathName(document: Document, url: string): string {
  // Use the browsers capabilities to get the pathname out of an url
  // with an anchor element this strips hashes and query params away from the url
  const a = document.createElement('a');
  a.href = url || '/';
  return a.pathname.substr(1);
}
