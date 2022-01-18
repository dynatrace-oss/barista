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

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ba-page-footer',
  templateUrl: 'page-footer.html',
  styleUrls: ['page-footer.scss'],
  host: {
    class: 'ba-page-footer',
  },
})
export class BaPageFooter {
  /** links to pages, which are related to the current page */
  @Input() relatedTopics: string[];

  /** keywords with which the current page is tagged */
  @Input() tags: string[];

  /** @internal */
  get _hasTags(): boolean {
    return this.tags && this.tags.length > 0;
  }

  /** @internal */
  get _hasRelatedTopics(): boolean {
    return this.relatedTopics && this.relatedTopics.length > 0;
  }
}
