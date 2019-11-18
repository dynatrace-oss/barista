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

import { BaPage } from '../page-outlet';
import { BaRecentlyOrderedService } from '../../shared/recently-ordered.service';
import { BaSinglePageContents } from '../../shared/page-contents';

@Component({
  selector: 'ba-single-page',
  templateUrl: 'single-page.html',
})
export class BaSinglePage implements BaPage, AfterViewInit {
  get contents(): BaSinglePageContents {
    return this._contents;
  }
  set contents(value: BaSinglePageContents) {
    this._contents = value;
    this._recentlyOrderedService.saveToLocalStorage(this.contents);
  }

  private _contents: BaSinglePageContents;

  constructor(private _recentlyOrderedService: BaRecentlyOrderedService) {}

  ngAfterViewInit(): void {
    this._recentlyOrderedService.saveToLocalStorage(this.contents);
  }
}
