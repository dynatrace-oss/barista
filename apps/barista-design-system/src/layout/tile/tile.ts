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

import { BaCategoryNavigationSectionItem } from '@dynatrace/shared/barista-definitions';

@Component({
  selector: 'a[ba-tile]',
  templateUrl: 'tile.html',
  styleUrls: ['tile.scss'],
  host: {
    '[href]': 'data.link',
    class: 'ba-tile',
  },
})
export class BaTile implements OnChanges {
  @Input() data: BaCategoryNavigationSectionItem;
  @Input() listView = true;

  /** @internal whether the tile has the badge 'favorite' */
  _favorite = false;

  /** @internal whether the tile has the badge 'deprecated' */
  _deprecated = false;

  /** @internal whether the tile has the badge 'experimental' */
  _experimental = false;

  /** @internal whether the tile has the badge 'workinprogress' */
  _workinprogress = false;

  /** @internal whether the tile has a badge */
  _hasBadge = false;

  constructor(private _elementRef: ElementRef) {}

  /** set the focus on the nativeElement */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this._setBadge();
    }
  }

  /** if the tile has badge properties, only set one of the badge states to true, as only one state can be displayed */
  private _setBadge(): void {
    this._favorite = false;
    this._hasBadge = false;
    this._deprecated = false;
    this._experimental = false;

    if (this.data.badge && this.data.badge.includes('favorite')) {
      this._favorite = true;
    } else if (this.data.badge && this.data.badge.includes('deprecated')) {
      this._deprecated = true;
    } else if (this.data.badge && this.data.badge.includes('experimental')) {
      this._experimental = true;
    } else if (
      this.data.badge &&
      this.data.badge.includes('work in progress')
    ) {
      this._workinprogress = true;
    }

    this._hasBadge =
      this._favorite ||
      this._deprecated ||
      this._experimental ||
      this._workinprogress;
  }
}
