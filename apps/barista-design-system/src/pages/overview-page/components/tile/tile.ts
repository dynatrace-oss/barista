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

import { Component, ElementRef, Input } from '@angular/core';

import { BaCategoryNavigationSectionItem } from '@dynatrace/shared/design-system/interfaces';
import { BadgeType, Badge } from '../../shared';

@Component({
  selector: 'a[ba-tile]',
  templateUrl: 'tile.html',
  styleUrls: ['tile.scss'],
  host: {
    class: 'ba-tile',
  },
})
export class BaTile extends Badge {
  /** The component preview to display */
  @Input() set data(data: BaCategoryNavigationSectionItem) {
    this._data = data;
    this.checkBadgeType(data.badge);
  }
  get data(): BaCategoryNavigationSectionItem {
    return this._data;
  }
  @Input() listView = true;

  _data: BaCategoryNavigationSectionItem;

  /** @internal whether the tile has a badge and what type of badge */
  _badge: BadgeType | undefined;

  constructor(private _elementRef: ElementRef) {
    super();
  }

  /** set the focus on the nativeElement */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }
}
