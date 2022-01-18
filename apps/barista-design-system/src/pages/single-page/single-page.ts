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

import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  BaPageLayoutType,
  BaSinglePageContent,
} from '@dynatrace/shared/design-system/interfaces';
import {
  DsPageService,
  getUrlPathName,
} from '@dynatrace/shared/design-system/ui';
import { BaRecentlyOrderedService } from '../../shared/services/recently-ordered.service';
import { applyTableDefinitionHeadingAttr } from '../../utils/apply-table-definition-headings';
import { Platform } from '@angular/cdk/platform';
import { distinctUntilChanged, filter, pluck } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ba-single-page',
  templateUrl: 'single-page.html',
  styleUrls: ['single-page.scss'],
  host: {
    class: 'ba-page',
  },
})
export class BaSinglePage implements AfterViewInit, OnDestroy {
  /** @internal The current page content from the cms */
  _pageContent: BaSinglePageContent | null;

  /** @internal Whether the page is the icon overview page */
  _isIconOverview = this._isIconOverviewPage();

  private _contentSubscription = Subscription.EMPTY;

  constructor(
    private _router: Router,
    private _pageService: DsPageService<BaSinglePageContent>,
    private _recentlyOrderedService: BaRecentlyOrderedService,
    private _platform: Platform,
    @Inject(DOCUMENT) private _document: Document,
  ) {
    this._contentSubscription = this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        pluck('url'),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this._pageContent = this._pageService._getCurrentPage();
        this._isIconOverview = this._isIconOverviewPage();
        if (
          this._pageContent &&
          this._pageContent.layout !== BaPageLayoutType.Icon
        ) {
          this._recentlyOrderedService.savePage(
            this._pageContent,
            this._router.url,
          );
        }
      });
  }

  ngAfterViewInit(): void {
    if (this._platform.isBrowser) {
      const allTables = [].slice.call(this._document.querySelectorAll('table'));

      /** Add data attributes to all tables, to apply responsive behavior of the tables. */
      for (const table of allTables) {
        applyTableDefinitionHeadingAttr(table);
      }
    }
  }

  ngOnDestroy(): void {
    this._contentSubscription.unsubscribe();
  }

  /**
   * @internal
   * Checks whether the page is the icon overview page
   * based on the current URL.
   */
  private _isIconOverviewPage(): boolean {
    return (
      getUrlPathName(this._document, this._router.url) === 'resources/icons'
    );
  }
}
