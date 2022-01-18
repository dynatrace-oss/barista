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

import { Component, ElementRef, Input } from '@angular/core';
import { BaCategoryNavigationSectionItem } from '@dynatrace/shared/design-system/interfaces';
import { BadgeType } from './badge-type';

@Component({
  template: '',
})
export class BaOverviewTile {
  /** Whether to display the tiles in listview or not */
  @Input() listView = true;

  /** The preview data */
  @Input()
  get data(): BaCategoryNavigationSectionItem {
    return this._data;
  }
  set data(data: BaCategoryNavigationSectionItem) {
    this._data = data;
    this._badge = checkBadgeType(data.badge);
  }
  /** Data for the preview */
  private _data: BaCategoryNavigationSectionItem;

  set badge(badge: BadgeType | undefined) {
    this._badge = badge;
  }
  get badge(): BadgeType | undefined {
    return this._badge;
  }
  /** Badge to be checked */
  private _badge: BadgeType | undefined = undefined;

  constructor(private _elementRef: ElementRef) {}

  /** set the focus on the nativeElement */
  protected _focus(): void {
    this._elementRef.nativeElement.focus();
  }
}

/** Checks what type of badge has been propagated and sets the corresponding icon and style class */
function checkBadgeType(badge: string[]): BadgeType | undefined {
  if (badge.includes('deprecated')) {
    return {
      icon: '/assets/incident-white.svg',
      style: 'ba-tile-badge-warning',
    };
  }
  if (badge.includes('experimental')) {
    return {
      icon: '/assets/laboratory-white.svg',
      style: 'ba-tile-badge-warning',
    };
  }
  if (badge.includes('work in progress')) {
    return {
      icon: '/assets/maintenance-royalblue.svg',
      style: 'ba-tile-badge-workinprogress',
    };
  }
  if (badge.includes('favorite')) {
    return {
      icon: '/assets/favorite-white.svg',
      style: 'ba-tile-badge-favorite',
    };
  }
}
