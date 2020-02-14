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

import { Component, Input } from '@angular/core';

import { BaContributors } from '@dynatrace/shared/barista-definitions';

@Component({
  selector: 'ba-page-header',
  templateUrl: 'page-header.html',
  styleUrls: ['page-header.scss'],
  host: {
    class: 'ba-page-header',
  },
})
export class BaPageHeader {
  /** the title of the current page */
  @Input() title: string;

  /** the description of the current page */
  @Input() description: string;

  /** the contributors of the component on the current page */
  @Input() contributors: BaContributors;

  /** additional page properties, such as deprecated, dev utility,.. */
  @Input() properties: string[];

  /** @internal the link to the component on the current page has a link to the wiki page */
  @Input() wiki: string;

  /** @internal whether the component on the current page is themeable */
  @Input() themable: boolean;

  /** @internal */
  get _showContributors(): boolean {
    return (
      this.contributors &&
      ((this.contributors.dev != null && this.contributors.dev.length > 0) ||
        (this.contributors.ux != null && this.contributors.ux.length > 0))
    );
  }
}
