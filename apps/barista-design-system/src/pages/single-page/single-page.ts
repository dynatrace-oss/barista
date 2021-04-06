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

import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { map, tap } from 'rxjs/operators';
@Component({
  selector: 'ba-single-page',
  templateUrl: 'single-page.html',
  styleUrls: ['single-page.scss'],
  host: {
    class: 'ba-page',
  },
})
export class BaSinglePage implements AfterViewInit {
  /** @internal The current page content from the cms */
  _pageContent$ = this._activatedRoute.url.pipe(
    map(() => this._pageService._getCurrentPage()),
    tap((content) => {
      if (content && content.layout !== BaPageLayoutType.Icon) {
        this._recentlyOrderedService.savePage(content, this._router.url);
      }
    }),
  );

  /** @internal Whether the page is the icon overview page */
  _isIconOverview = this._isIconOverviewPage();

  constructor(
    private _router: Router,
    private _pageService: DsPageService<BaSinglePageContent>,
    private _recentlyOrderedService: BaRecentlyOrderedService,
    private _platform: Platform,
    private _activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private _document: Document,
  ) {}

  ngAfterViewInit(): void {
    if (this._platform.isBrowser) {
      const allTables = [].slice.call(this._document.querySelectorAll('table'));

      /** Add data attributes to all tables, to apply responsive behavior of the tables. */
      for (const table of allTables) {
        applyTableDefinitionHeadingAttr(table);
      }
    }
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
