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

import { Component } from '@angular/core';
import { BaIndexPageContent, BaPageLink } from '@dynatrace/barista-definitions';
import { BaRecentlyOrderedService } from '../../shared/recently-ordered.service';
import { BaPage } from '../page-outlet';
import { environment } from './../../environments/environment';

@Component({
  selector: 'ba-index-page',
  templateUrl: 'index-page.html',
  styleUrls: ['index-page.scss'],
})
export class BaIndexPage implements BaPage {
  contents: BaIndexPageContent;

  /** @internal whether the internal content should be displayed */
  _internal = environment.internal;
  /** @internal array of recently visited pages */
  _orderedItems: (BaPageLink | null)[];

  constructor(private _recentlyOrderedService: BaRecentlyOrderedService) {
    this._orderedItems = this._recentlyOrderedService.getRecentlyOrderedItems();
  }
}
