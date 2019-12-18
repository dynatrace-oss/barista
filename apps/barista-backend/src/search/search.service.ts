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
import { Injectable, HttpService } from '@nestjs/common';
import { environment } from '../environments/environment';
import { Index } from 'lunr';
import {
  BaSearchResult,
  BaSinglePageContent,
} from '@dynatrace/barista-components/barista-definitions';
import { Observable, of, combineLatest } from 'rxjs';
import { tap, map, take, mapTo } from 'rxjs/operators';
import { mapContentToSearchResult } from './map-content-to-search-result';

// 5 Minutes of cache.
const CACHE_EXPIRES_DURATION = 1000 * 60 * 5;
const RESULT_THRESHOLD = 2;

@Injectable()
export class SearchService {
  private _index: Index;

  private _documentCache: Map<
    string,
    { timestamp: number; data: BaSinglePageContent }
  > = new Map();

  constructor(private readonly _http: HttpService) {
    // Initialize the search index on startup
    this._refreshSearchIndex()
      .pipe(take(1))
      .subscribe();
  }

  /**
   * Finds something in the search index based on the passed
   * query parameter and returns a list of search results.
   * @param query Query string that should be searched
   */
  find(query: string): Observable<BaSearchResult[]> {
    if (this._index) {
      const results = this._index.search(query);

      const allPages = results
        .filter(result => result.score > RESULT_THRESHOLD)
        .map(r => this._getContentSource(r.ref));

      return combineLatest(allPages).pipe(
        take(1),
        map(contents => mapContentToSearchResult(contents, results)),
      );
    }
    return of([]);
  }

  /** Triggers the reload of the search index from the remote. */
  triggerUpdate(): Observable<void> {
    return this._refreshSearchIndex();
  }

  /** Refresh the prebuilt search index. */
  private _refreshSearchIndex(): Observable<void> {
    return this._http.get(`${environment.dataHost}/_search-index.json`).pipe(
      tap(searchIndex => (this._index = Index.load(searchIndex.data))),
      mapTo(undefined),
    );
  }

  /** Get the document and cache it if we can */
  private _getContentSource(path: string): Observable<BaSinglePageContent> {
    const now = Date.now();
    let sanitizedPath = path;
    // Sanitize the path, to get this one done
    if (sanitizedPath.endsWith('/')) {
      sanitizedPath = sanitizedPath.slice(0, -1);
    }
    // Check if we have the document in the cache and return it if we do.
    if (this._documentCache.has(sanitizedPath)) {
      const cachedContent = this._documentCache.get(sanitizedPath);
      if (cachedContent!.timestamp > now - CACHE_EXPIRES_DURATION) {
        return of(cachedContent!.data);
      }
    }

    // If we don't have the content in the documentCache or the cache expired,
    // we should get it from the source.
    return this._http
      .get<BaSinglePageContent>(`${environment.dataHost}/${sanitizedPath}.json`)
      .pipe(
        map(response => response.data),
        tap(content =>
          this._documentCache.set(sanitizedPath, {
            timestamp: now,
            data: content,
          }),
        ),
      );
  }
}
