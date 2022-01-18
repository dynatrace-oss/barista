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

import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { BaSearchService } from '../../../shared/services/search.service';
import {
  Observable,
  fromEvent,
  Subject,
  BehaviorSubject,
  combineLatest,
} from 'rxjs';
import {
  distinctUntilChanged,
  map,
  debounceTime,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { BaSearchResult } from '@dynatrace/shared/design-system/interfaces';
import { FocusMonitor, FocusKeyManager } from '@angular/cdk/a11y';
import { BaSearchResultItem } from './search-result-item';
import { Router } from '@angular/router';

@Component({
  selector: 'ba-search',
  templateUrl: 'search.html',
  styleUrls: ['search.scss'],
  host: {
    class: 'ba-search',
  },
})
export class BaSearch implements OnInit, AfterViewInit, OnDestroy {
  /** Destroy subject */
  private destroy$ = new Subject<void>();

  /** Subject to determine if the search has focus. */
  private hasFocus$: Observable<boolean>;

  // FocusKeyManager instance
  private _keyManager: FocusKeyManager<BaSearchResultItem>;

  /** Proxy key events to the keymanager */
  onKeydown(event: KeyboardEvent): void {
    this._keyManager.onKeydown(event);
  }

  /** Flag that indicates if the overlay / search results should be shown. */
  showResults$: Observable<boolean>;

  @ViewChild('searchInput', { static: true }) _searchInput: ElementRef;

  @ViewChildren(BaSearchResultItem)
  _searchResultOptions: QueryList<BaSearchResultItem>;

  /** Defines if the overlay / results are shown */
  searchResults$ = new BehaviorSubject<BaSearchResult[]>([]);

  constructor(
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef,
    private _searchService: BaSearchService,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    /** Subscribe to the events of the keyboard to fire the search */
    fromEvent(this._searchInput.nativeElement, 'keyup')
      .pipe(
        map((event: KeyboardEvent) => {
          event.stopPropagation();
          return this._searchInput.nativeElement.value;
        }),
        distinctUntilChanged(),
        debounceTime(150),
        switchMap((query) => this._searchService.search(query)),
        takeUntil(this.destroy$),
      )
      // Switched to a BehaviorSubject here, as using an Observable
      // and letting the template subscribe led to some very weird
      // timing issues, where the overlay was not shown although all
      // conditions were met.
      .subscribe((result) => this.searchResults$.next(result));
  }

  ngAfterViewInit(): void {
    this.hasFocus$ = this._focusMonitor.monitor(this._elementRef, true).pipe(
      map((origin) => {
        return origin !== null;
      }),
    );

    this.showResults$ = combineLatest(this.hasFocus$, this.searchResults$).pipe(
      map(([hasFocus, searchResults]) => {
        // return hasFocus && searchResults.length > 0;
        return true;
      }),
    );

    this._keyManager = new FocusKeyManager(
      this._searchResultOptions,
    ).withWrap();
  }

  ngOnDestroy(): void {
    // Remove the focus monitor again.
    this._focusMonitor.stopMonitoring(this._elementRef);

    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Navigate to the given url via the router. */
  navigateTo(url: string): void {
    const targetUrl = new URL(url);
    // Make sure that router path does not end with a slash!
    const targetPath = targetUrl.pathname.endsWith('/')
      ? targetUrl.pathname.slice(0, -1)
      : targetUrl.pathname;
    this._router.navigateByUrl(targetPath);

    // Reset the search
    this.searchReset();
  }

  /** Reset the search result and search field upon navigation. */
  searchReset(): void {
    this._searchInput.nativeElement.value = '';
    this.searchResults$.next([]);
  }
}
