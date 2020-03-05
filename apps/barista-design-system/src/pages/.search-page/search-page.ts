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

import { BaPage } from '../page-outlet';
import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import {
  BaSinglePageContent,
  BaSearchResult,
} from '@dynatrace/shared/barista-definitions';
import { Observable, fromEvent, merge, EMPTY } from 'rxjs';
import {
  debounceTime,
  map,
  filter,
  distinctUntilChanged,
  tap,
  take,
  switchMap,
} from 'rxjs/operators';
import { BaSearchService } from '../../shared/services/search.service';
import { BaLocationService } from '../../shared/services/location.service';

@Component({
  selector: 'ba-search-page',
  templateUrl: 'search-page.html',
  styleUrls: ['search-page.scss'],
})
export class BaSearchPage implements BaPage, AfterViewInit {
  /**
   * Contents input that is necessary for the BaPage interface,
   * but is not in use
   */
  @Input() contents: BaSinglePageContent;

  /** @internal Viewchild of the query input field to get the changes events. */
  @ViewChild('queryInput', { static: true }) _queryInput: ElementRef;

  /** @internal Search results for the last query. */
  _searchResults$: Observable<BaSearchResult[]> = EMPTY;

  /** Value of the query mapped to the input. */
  queryValue: string;

  constructor(
    private readonly _searchService: BaSearchService,
    private readonly _locationService: BaLocationService,
  ) {}

  ngAfterViewInit(): void {
    // Get the current query from the route and set it into the search
    // field if necessary.
    const currentRouteQuery$ = this._locationService.currentQuery$.pipe(
      map(params => params.get('q')),
      filter(Boolean),
      take(1),
      tap((query: string) => (this.queryValue = query!)),
    );

    // Get updates from the search input field
    // and update the location and searchresults if necessary
    const querySearchQuery$ = fromEvent(
      this._queryInput.nativeElement,
      'input',
    ).pipe(
      debounceTime(100),
      map(() => this.queryValue),
      filter(Boolean),
      distinctUntilChanged(),
      tap(query => this._locationService.go(`/search/?q=${query}`)),
    );

    // Subscribe to the current query and
    // query the search api.
    this._searchResults$ = merge(currentRouteQuery$, querySearchQuery$).pipe(
      switchMap((query: string) => this._searchService.search(query)),
    );
  }
}
