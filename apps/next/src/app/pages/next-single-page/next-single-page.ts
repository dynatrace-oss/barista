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

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BaSinglePageContent } from '@dynatrace/shared/barista-definitions';
import { BaPageService } from '@dynatrace/shared/data-access-strapi';

@Component({
  selector: 'next-single-page',
  templateUrl: 'next-single-page.html',
  styleUrls: ['next-single-page.scss'],
  host: {
    class: 'next-page',
  },
})
export class NextSinglePage implements OnInit, AfterViewInit {
  /** @internal The current page content from the cms */
  _pageContent = this._pageService._getCurrentPage();

  constructor(private _pageService: BaPageService<BaSinglePageContent>) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}
}
