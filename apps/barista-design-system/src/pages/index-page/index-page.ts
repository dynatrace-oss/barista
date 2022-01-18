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

import { Component } from '@angular/core';
import { DsPageService } from '@dynatrace/shared/design-system/ui';
import { environment } from '../../environments/environment';
import { BaSinglePageContent } from '@dynatrace/shared/design-system/interfaces';
import {
  BaRecentlyOrderedService,
  BaRecentlyOrderedItem,
} from '../../shared/services/recently-ordered.service';

@Component({
  selector: 'ba-index-page',
  templateUrl: './index-page.html',
  styleUrls: ['./index-page.scss'],
  host: {
    class: 'ba-page',
  },
})
export class BaIndexPage {
  content = this._pageService._getCurrentPage();

  /** @internal whether the internal content should be displayed */
  _internal = environment.internal;
  /** @internal array of recently visited pages */
  _orderedItems: (BaRecentlyOrderedItem | undefined)[] = [];
  /** @internal whether recently ordered items should be displayed */
  _showOrderedItems = false;

  constructor(
    private _pageService: DsPageService<BaSinglePageContent>,
    private _recentlyOrderedService: BaRecentlyOrderedService,
  ) {
    const items = this._recentlyOrderedService.getPages();
    this._showOrderedItems = Boolean(items.length > 0);
    // create the ghost tiles to fill up the remaining space
    this._orderedItems = [...items, ...new Array(7 - items.length)];
  }
}
