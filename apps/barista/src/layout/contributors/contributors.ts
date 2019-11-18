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

import { Component, Input } from '@angular/core';

import { formatContributorName } from '../../utils/formatContributorNames';

const BITBUCKET_USERNAME_LENGTH = 20;

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
  @Input() names: string[];

  /**
   * @internal
   * returns the name capitalized and with a space between first and last name
   */
  _displayName(name: string): string {
    return formatContributorName(name);
  }

  /** @internal */
  _imageUrl(name: string): string {
    const bitbucketUser = name.slice(0, BITBUCKET_USERNAME_LENGTH);
    return `<bitbucket-url>${bitbucketUser}/avatar.png?s=64`;
  }

  /** @internal */
  get _columnLabel(): string {
    return this.type === 'ux' ? 'UX support' : 'Dev support';
  }
}
