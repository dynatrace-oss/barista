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

import { AfterViewInit, Component } from '@angular/core';

import { fillTableData } from '../../utils/fillTableData';
import { BaPage } from '../page-outlet';
import { BaRecentlyOrderedService } from '../../shared/recently-ordered.service';
import { BaSinglePageContent } from '@dynatrace/barista-components/barista-definitions';

@Component({
  selector: 'ba-single-page',
  templateUrl: 'single-page.html',
})
export class BaSinglePage implements BaPage, AfterViewInit {
  get contents(): BaSinglePageContent {
    return this._contents;
  }
  set contents(value: BaSinglePageContent) {
    this._contents = value;
    this._recentlyOrderedService.saveToLocalStorage(this.contents);
  }

  private _contents: BaSinglePageContent;

  constructor(private _recentlyOrderedService: BaRecentlyOrderedService) {}

  ngAfterViewInit(): void {
    this._recentlyOrderedService.saveToLocalStorage(this.contents);
    this._checkURL();

    const allTables = Array.prototype.slice.call(
      document.querySelectorAll('table'),
    );

    /** Add data attributes to all tables, to apply responsive behaviour of the tables.* */
    for (const table of allTables) {
      fillTableData(table);
    }
  }

  /** check if the url contains a hash and scroll to the matching headline */
  private _checkURL(): void {
    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash || '');
      if (target) {
        requestAnimationFrame(() => {
          target.scrollIntoView();
        });
      }
    }
  }

  /** @internal Whether to display the table of contents on the page. */
  _showTOC(): boolean {
    return this.contents && this.contents.toc !== false;
  }
}
