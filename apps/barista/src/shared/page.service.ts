/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { BaLocationService } from './location.service';
import { BaSinglePageContent } from '@dynatrace/barista-components/barista-definitions';

const CONTENT_PATH_PREFIX = 'data/';

@Injectable()
export class BaPageService {
  /**
   * Caches pages once they have been loaded.
   */
  private _cache = new Map<string, Observable<BaSinglePageContent>>();

  /**
   * The current page that should be displayed.
   */
  currentPage: Observable<BaSinglePageContent>;

  constructor(private http: HttpClient, location: BaLocationService) {
    // Whenever the URL changes we try to get the appropriate doc
    this.currentPage = location.currentPath$.pipe(
      switchMap(path => this._getPage(path)),
    );
  }

  /**
   * Gets page from cache.
   * @param url - path to page
   */
  private _getPage(url: string): Observable<BaSinglePageContent> {
    const id = url || 'index';
    if (!this._cache.has(id)) {
      this._cache.set(id, this._fetchPage(id));
    }
    return this._cache.get(id)!;
  }

  /**
   * Fetches page from data source.
   * @param id - page id (path).
   */
  private _fetchPage(id: string): Observable<BaSinglePageContent> {
    const requestPath = `${CONTENT_PATH_PREFIX}${id}.json`;
    const subject = new AsyncSubject<BaSinglePageContent>();

    this.http
      .get<BaSinglePageContent>(requestPath, { responseType: 'json' })
      .pipe
      // tap(data => {
      //   console.log(data);
      // })
      ()
      .subscribe(subject);

    return subject.asObservable();
  }
}
