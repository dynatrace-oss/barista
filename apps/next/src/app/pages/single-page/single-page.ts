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
import { BaSinglePageContent } from '@dynatrace/shared/design-system/interfaces';
import { DsPageService } from '@dynatrace/shared/design-system/ui';
import '@dynatrace/fluid-elements/button';

@Component({
  selector: 'ds-single-page',
  templateUrl: 'single-page.html',
  styleUrls: ['single-page.scss'],
  host: {
    class: 'ds-single-page',
  },
})
export class SinglePage {
  /** @internal The current page content from the cms */
  _pageContent = this._pageService._getCurrentPage();

  constructor(private _pageService: DsPageService<BaSinglePageContent>) {}
}
