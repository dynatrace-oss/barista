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

import { BadgeType } from './badge-type';

export class Badge {
  /** Badge to be checked */
  _badge: BadgeType | undefined = undefined;
  set badge(badge: BadgeType | undefined) {
    this._badge = badge;
  }
  get badge(): BadgeType | undefined {
    return this._badge;
  }

  /** Checks what type of badge has been propagated and sets the corresponding icon and style class */
  checkBadgeType(badge: string[]): void {
    if (badge.includes('favorite')) {
      this._badge = {
        icon: '/assets/favorite-white.svg',
        style: 'ba-tile-badge-favorite',
      };
    }
    if (badge.includes('deprecated')) {
      this._badge = {
        icon: '/assets/incident-white.svg',
        style: 'ba-tile-badge-warning',
      };
    }
    if (badge.includes('experimental')) {
      this._badge = {
        icon: '/assets/laboratory-white.svg',
        style: 'ba-tile-badge-warning',
      };
    }
    if (badge.includes('work in progress')) {
      this._badge = {
        icon: '/assets/maintenance-royalblue.svg',
        style: 'ba-tile-badge-workinprogress',
      };
    }
  }
}
