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
import { BaContributor } from '@dynatrace/shared/barista-definitions';

@Component({
  selector: 'ba-contributors',
  templateUrl: 'contributors.html',
  styleUrls: ['contributors.scss'],
  host: {
    class: 'ba-contributors-column',
  },
})
export class BaContributors {
  @Input() type: 'ux' | 'dev';
  @Input() contributors: BaContributor[];

  /** @internal */
  _imageUrl(gitHubUser: string): string {
    return `https://github.com/${gitHubUser}.png?s=64`;
  }

  /** @internal */
  _profileUrl(gitHubUser: string): string {
    return `https://github.com/${gitHubUser}`;
  }

  /** @internal */
  get _columnLabel(): string {
    return this.type === 'ux' ? 'UX support' : 'Dev support';
  }
}
