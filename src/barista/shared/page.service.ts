import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { BaLocationService } from './location.service';
import { BaPageContents } from './page-contents';

const CONTENT_PATH_PREFIX = 'data/';

@Injectable()
export class BaPageService {
  /**
   * Caches pages once they have been loaded.
   */
  private _cache = new Map<string, Observable<BaPageContents>>();

  /**
   * The current page that should be displayed.
   */
  currentPage: Observable<BaPageContents>;

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
  private _getPage(url: string): Observable<BaPageContents> {
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
  private _fetchPage(id: string): Observable<BaPageContents> {
    const requestPath = `${CONTENT_PATH_PREFIX}${id}.json`;
    const subject = new AsyncSubject<BaPageContents>();

    this.http
      .get<BaPageContents>(requestPath, { responseType: 'json' })
      .pipe
      // tap(data => {
      //   console.log(data);
      // })
      ()
      .subscribe(subject);

    return subject.asObservable();
  }
}
