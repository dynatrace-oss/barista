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

import { DEFAULT_PAGE_THEME } from '../../app';
import { BaPageLink } from '@dynatrace/shared/barista-definitions';

@Component({
  selector: 'ba-smalltile',
  templateUrl: 'smalltile.html',
  styleUrls: ['smalltile.scss'],
  host: {
    '[class.ba-smalltile-link-wrapper]': 'data',
  },
})
export class BaSmallTile {
  @Input() data: BaPageLink;

  /** @internal Gets the tile's theme based on its category. */
  get _theme(): string {
    if (this.data) {
      switch (this.data.category) {
        case 'Brand':
          return 'purple';
        case 'Resources':
          return 'blue';
        case 'Components':
          return 'royalblue';
      }
    }
    return DEFAULT_PAGE_THEME;
  }

  /** @internal Gets the tile's identifier based on the title. */
  get _identifier(): string {
    if (this.data.title) {
      return this.data.title.slice(0, 2);
    }

    return 'Id';
  }
}
