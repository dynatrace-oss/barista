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

import { Injectable } from '@angular/core';

import { BaIndexPageItem, BaSinglePageContents } from './page-contents';

const LOCALSTORAGEKEY = 'recentlyordered';
const NUMBER_OF_RECENT_ITEMS = 7;

@Injectable()
export class BaRecentlyOrderedService {
  //  orderedItems: BaIndexPageItem[] = [];
  orderedItems: (BaIndexPageItem | null)[] = [];

  constructor() {
    if ('localStorage' in window) {
      const recentlyOrderedInStorage = localStorage.getItem(LOCALSTORAGEKEY);
      this.orderedItems = recentlyOrderedInStorage
        ? JSON.parse(recentlyOrderedInStorage)
        : [];
    }
  }

  saveToLocalStorage(page: BaSinglePageContents): void {
    const orderedItem = {
      title: page.title,
      link: window.location.href,
      identifier: page.identifier || 'Id',
      category: page.category,
    };

    for (let i = 0; i < this.orderedItems.length; i++) {
      if (
        this.orderedItems[i] &&
        this.orderedItems[i]!.title === orderedItem.title
      ) {
        this.orderedItems.splice(i, 1);
      }
    }

    this.orderedItems.unshift(orderedItem);
    this.orderedItems = this.orderedItems.splice(0, NUMBER_OF_RECENT_ITEMS);

    if ('localStorage' in window) {
      window.localStorage.setItem(
        LOCALSTORAGEKEY,
        JSON.stringify(this.orderedItems),
      );
    }
  }

  getRecentlyOrderedItems(): (BaIndexPageItem | null)[] {
    while (this.orderedItems.length < NUMBER_OF_RECENT_ITEMS) {
      this.orderedItems.push(null);
    }

    return this.orderedItems;
  }
}
