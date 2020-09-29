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

@Component({
  selector: 'a[ba-component-preview-tile]',
  templateUrl: 'component-preview-tile.html',
  styleUrls: ['component-preview-tile.scss'],
  host: {
    class: 'ba-component-preview-tile',
  },
})
export class BaComponentPreviewTile {
  _data: BaCategoryNavigationSectionItem;

  /** The component preview to display */
  @Input() set data(data: BaCategoryNavigationSectionItem) {
    this._data = data;

    if (data.badge && data.badge.includes('favorite')) {
      this._badge = {
        icon: '/assets/favorite-white.svg',
        style: 'ba-tile-badge-favorite',
      };
    }
    if (data.badge && data.badge.includes('deprecated')) {
      this._badge = {
        icon: '/assets/incident-white.svg',
        style: 'ba-tile-badge-warning',
      };
    }
    if (data.badge && data.badge.includes('experimental')) {
      this._badge = {
        icon: '/assets/laboratory-white.svg',
        style: 'ba-tile-badge-warning',
      };
    }
    if (data.badge && data.badge.includes('work in progress')) {
      this._badge = {
        icon: '/assets/maintenance-royalblue.svg',
        style: 'ba-tile-badge-workinprogress',
      };
    }
  }
  get data(): BaCategoryNavigationSectionItem {
    return this._data;
  }

  /** Whether to display the description or not */
  @Input() listView = true;

  /** @internal whether the tile has a badge */
  _badge: { icon: string; style: string };

  constructor(private _elementRef: ElementRef) {}

  /** set the focus on the nativeElement */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }
}
