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

import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { BaSearchService } from '../../../shared/services/search.service';
import { Observable, fromEvent } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  debounceTime,
  switchMap,
} from 'rxjs/operators';
import { BaSearchResult } from '@dynatrace/shared/barista-definitions';
import { DtAutocompleteSelectedEvent } from '@dynatrace/barista-components/autocomplete';
import { Router } from '@angular/router';

@Component({
  selector: 'ba-search',
  templateUrl: 'search.html',
  styleUrls: ['search.scss'],
  host: {
    class: 'ba-search',
  },
})
export class BaSearch implements OnInit {
  @ViewChild('searchInput', { static: true }) _searchInput: ElementRef;

  searchResults$: Observable<BaSearchResult[]>;

  constructor(
    private _searchService: BaSearchService,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this.searchResults$ = fromEvent(
      this._searchInput.nativeElement,
      'input',
    ).pipe(
      map(() => this._searchInput.nativeElement.value),
      distinctUntilChanged(),
      debounceTime(150),
      switchMap(query => this._searchService.search(query)),
      map(results =>
        results.slice(0, 8).map(result => {
          result.title = result.title.replace('Barista - ', '');
          return result;
        }),
      ),
    );
  }

  /** Handle option selected */
  optionSelected(event: DtAutocompleteSelectedEvent<BaSearchResult>): void {
    if (event.option.value) {
      const targetUrl = new URL(event.option.value.url);
      // Make sure that router path does not end with a slash!
      const targetPath = targetUrl.pathname.endsWith('/')
        ? targetUrl.pathname.slice(0, -1)
        : targetUrl.pathname;
      this._router.navigateByUrl(targetPath);
    }
  }

  /** Should not reflect the content of the selected autocomplete in the input */
  displayWith(): string {
    return '';
  }
}
