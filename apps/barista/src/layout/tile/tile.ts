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

import { Component, ElementRef, Input } from '@angular/core';

import { BaOverviewPageSectionItem } from '../../shared/page-contents';

@Component({
  selector: 'a[ba-tile]',
  templateUrl: 'tile.html',
  styleUrls: ['tile.scss'],
  host: {
    '[href]': 'data.link',
    class: 'ba-tile',
  },
})
export class BaTile {
  @Input() data: BaOverviewPageSectionItem;
  @Input() listView = true;

  /** @internal whether the tile has the badge 'favorite' */
  get _favorite(): boolean {
    return (this.data.badge && this.data.badge === 'favorite') || false;
  }

  /** @internal whether the tile has the badge 'workinprogress' */
  get _workinprogress(): boolean {
    return (this.data.badge && this.data.badge === 'workinprogress') || false;
  }

  /** @internal whether the tile has the badge 'deprecated' */
  get _deprecated(): boolean {
    return (this.data.badge && this.data.badge === 'deprecated') || false;
  }

  /** @internal whether the tile has the badge 'experimental' */
  get _experimental(): boolean {
    return (this.data.badge && this.data.badge === 'experimental') || false;
  }

  constructor(private _elementRef: ElementRef) {}

  /** set the focus on the nativeElement */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }
}
