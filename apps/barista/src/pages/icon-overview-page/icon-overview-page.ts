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

import {
  AfterViewInit,
  Component,
  OnDestroy,
  ElementRef,
  ViewChild,
  OnInit,
} from '@angular/core';

import {
  BaIconOverviewPageContent,
  BaIcon,
} from '@dynatrace/barista-definitions';

import { BaPage } from '../page-outlet';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BaRecentlyOrderedService } from '../../shared/recently-ordered.service';

@Component({
  selector: 'ba-icon-overview-page',
  templateUrl: 'icon-overview-page.html',
  styleUrls: ['icon-overview-page.scss'],
})
export class BaIconOverviewPage
  implements AfterViewInit, OnInit, OnDestroy, BaPage {
  /** Page contents */
  contents: BaIconOverviewPageContent;

  /** Filter input field */
  @ViewChild('filter', { static: true }) _inputEl: ElementRef<HTMLInputElement>;

  /** @internal A list of filtered icons */
  _filteredIcons: BaIcon[];

  /** Subscription on filter change event */
  private _filterChangeSubscription = Subscription.EMPTY;

  constructor(private _recentlyOrderedService: BaRecentlyOrderedService) {}

  ngOnInit(): void {
    let filterParam = '';
    if (window) {
      // Prefill input field value if given via URL search params.
      const searchParams = new window.URL(window.location.href).searchParams;
      filterParam = searchParams.get('iconFilter') || '';
      this._inputEl.nativeElement.value = filterParam;
    }
    this._updateFilteredIcons(filterParam);
  }

  ngAfterViewInit(): void {
    this._recentlyOrderedService.saveToLocalStorage(this.contents);

    this._filterChangeSubscription = fromEvent(
      this._inputEl.nativeElement,
      'input',
    )
      .pipe(debounceTime(200))
      .subscribe(() => {
        const filterValue = this._inputEl.nativeElement.value.toLowerCase();
        this._updateFilteredIcons(filterValue);
        this._updateWindowHistory(filterValue);
      });
  }

  ngOnDestroy(): void {
    this._filterChangeSubscription.unsubscribe();
  }

  /**
   * Updates list of icons. Filters icons based on the given value
   * and its occurence in the icon's name or in the list of tags.
   */
  private _updateFilteredIcons(filterValue: string): void {
    const allIcons = this.contents.icons;
    const nameMatchIcons = allIcons.filter(
      icon => icon.name.toLowerCase().indexOf(filterValue) !== -1,
    );
    const tagMatchIcons = allIcons.filter(
      icon =>
        // Remove name matches to avoid duplicates in the result
        !nameMatchIcons.includes(icon) &&
        (!icon.tags ||
          icon.tags.filter(
            tagname =>
              tagname && tagname.toLowerCase().indexOf(filterValue) !== -1,
          ).length > 0),
    );
    this._filteredIcons = nameMatchIcons.concat(tagMatchIcons);
  }

  /** Updates the URL without page reload. */
  private _updateWindowHistory(filterValue: string): void {
    if (window) {
      if (filterValue.length) {
        window.history.pushState(
          {},
          '',
          `${window.location.origin}${window.location.pathname}?iconFilter=${filterValue}`,
        );
      } else {
        window.history.pushState(
          {},
          '',
          `${window.location.origin}${window.location.pathname}`,
        );
      }
    }
  }
}
