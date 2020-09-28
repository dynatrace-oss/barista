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

import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { BaCategoryNavigationSectionItem } from '@dynatrace/shared/design-system/interfaces';

@Component({
  selector: 'a[ba-tile]',
  templateUrl: 'tile.html',
  styleUrls: ['tile.scss'],
  host: {
    class: 'ba-tile',
  },
})
export class BaTile {
  _data: BaCategoryNavigationSectionItem;

  /** The component preview to display */
  @Input() set data(data: BaCategoryNavigationSectionItem) {
    this._data = data;
    this._badge.length = 0;

    if (data.badge && data.badge.includes('favorite')) {
      this._badge = ['/assets/favorite-white.svg', 'ba-tile-badge-favorite'];
    }
    if (data.badge && data.badge.includes('deprecated')) {
      this._badge = ['/assets/incident-white.svg', 'ba-tile-badge-warning'];
    }
    if (data.badge && data.badge.includes('experimental')) {
      this._badge = ['/assets/laboratory-white.svg', 'ba-tile-badge-warning'];
    }
    if (data.badge && data.badge.includes('work in progress')) {
      this._badge = [
        '/assets/maintenance-royalblue.svg',
        'ba-tile-badge-workinprogress',
      ];
    }
  }
  get data(): BaCategoryNavigationSectionItem {
    return this._data;
  }
  @Input() listView = true;

  /** @internal whether the tile has a badge */
  _badge: string[] = [];

  constructor(private _elementRef: ElementRef) {}

  /** set the focus on the nativeElement */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }
}
