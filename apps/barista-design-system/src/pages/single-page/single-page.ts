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

import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  BaPageLayoutType,
  BaSinglePageContent,
} from '@dynatrace/shared/barista-definitions';
import {
  DSPageService,
  getUrlPathName,
} from '@dynatrace/shared/data-access-strapi';
import { BaRecentlyOrderedService } from '../../shared/services/recently-ordered.service';
import { applyTableDefinitionHeadingAttr } from '../../utils/apply-table-definition-headings';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'ba-single-page',
  templateUrl: 'single-page.html',
  styleUrls: ['single-page.scss'],
  host: {
    class: 'ba-page',
  },
})
export class BaSinglePage implements OnInit, AfterViewInit {
  /** @internal The current page content from the cms */
  _pageContent = this._pageService._getCurrentPage();

  /** @internal Whether the page is the icon overview page */
  _isIconOverview = this._isIconOverviewPage();

  constructor(
    private _router: Router,
    private _pageService: DSPageService<BaSinglePageContent>,
    private _recentlyOrderedService: BaRecentlyOrderedService,
    private _platform: Platform,
    @Inject(DOCUMENT) private _document: any,
  ) {}

  ngOnInit(): void {
    if (
      this._pageContent &&
      this._pageContent.layout !== BaPageLayoutType.Icon
    ) {
      this._recentlyOrderedService.savePage(
        this._pageContent,
        this._router.url,
      );
    }
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
