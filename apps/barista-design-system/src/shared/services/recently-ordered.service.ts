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

import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';

import { BaPageLink } from '@dynatrace/shared/design-system/interfaces';
import { getUrlPathName } from '@dynatrace/shared/design-system/ui';

const LOCAL_STORAGE_KEY = 'barista-recently-ordered';
const NUMBER_OF_RECENT_ITEMS = 7;

export type BaRecentlyOrderedItem = BaPageLink & { timestamp: number };

@Injectable()
export class BaRecentlyOrderedService {
  constructor(
    private _platform: Platform,
    @Inject(DOCUMENT) private _document: any,
  ) {}

  /** Get an array of all recently ordered pages ☕️ */
  getPages(): BaRecentlyOrderedItem[] {
    return Array.from(this._getFromStore().values()).sort((a, b) =>
      a.timestamp < b.timestamp ? 1 : -1,
    );
  }

  /** Save a page as recently ordered */
  savePage(page: { title: string; category?: string }, url: string): void {
    if (!this._platform.isBrowser) {
      return;
    }

    const storedItems = this._getFromStore();
    storedItems.set(page.title, {
      title: page.title,
      link: getUrlPathName(this._document, url),
      timestamp: new Date().getTime(),
      category: page.category,
    });

    this._storeItems(storedItems);
  }

  /** Get the pages from the local storage */
  private _getFromStore(): Map<string, BaRecentlyOrderedItem> {
    const stored = this._platform.isBrowser
      ? localStorage.getItem(LOCAL_STORAGE_KEY) || '[]'
      : '[]';
    return new Map<string, BaRecentlyOrderedItem>(JSON.parse(stored) as any);
  }

  /** Store the pages in the local storage */
  private _storeItems(items: Map<string, BaRecentlyOrderedItem>): void {
    const sliced = Array.from(items.entries())
      .sort(([, a], [, b]) => (a.timestamp < b.timestamp ? 1 : -1))
      .slice(0, NUMBER_OF_RECENT_ITEMS);

    const serialized = JSON.stringify(sliced);
    localStorage.setItem(LOCAL_STORAGE_KEY, serialized);
  }
}
