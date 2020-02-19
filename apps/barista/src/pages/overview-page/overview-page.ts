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

import { A, Z } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

import { BaCategoryNavigationContent } from '@dynatrace/barista-definitions';
import { BaPage } from '../../pages/page-outlet';
import { BaTile } from '../../layout/tile/tile';
import { _readKeyCode } from '@dynatrace/barista-components/core';

const LOCALSTORAGEKEY = 'baristaGridview';

@Component({
  selector: 'ba-overview-page',
  templateUrl: 'overview-page.html',
  styleUrls: ['overview-page.scss'],
})
export class BaOverviewPage implements AfterViewInit, BaPage, OnDestroy {
  contents: BaCategoryNavigationContent;

  /** @internal whether the tiles are currently displayed as list */
  _listViewActive = true;
  /** the previous pressed key */
  private _previousKey: string;
  /** counter how often the same key is pressed */
  private _counter = 0;
  /** items which should be accessible with shortcuts  */
  private _shortcutItems = [];

  private _keyUpSubscription = Subscription.EMPTY;

  /** @internal BaTiles which should be accessible with shortcuts */
  @ViewChildren(BaTile) _items: QueryList<BaTile>;

  constructor() {
    // check the local storage and set the initial value for the display of the tiles
    if ('localStorage' in window) {
      const localStorageState = localStorage.getItem(LOCALSTORAGEKEY);
      this._listViewActive = localStorageState !== 'tiles';
    }
  }

  /**
   * prepare the items that should be available via shortcuts
   * and subscribe for keyup events
   */
  ngAfterViewInit(): void {
    this._prepareItems();

    this._keyUpSubscription = fromEvent(document, 'keyup').subscribe(
      (evt: KeyboardEvent) => {
        const keyCode = _readKeyCode(evt);
        if (keyCode >= A && keyCode <= Z) {
          this._focusItem(evt.key.toLowerCase());
        }
      },
    );
  }

  ngOnDestroy(): void {
    this._keyUpSubscription.unsubscribe();
  }

  /**
   * @internal
   * switch the display of the overview items
   * between list view and tile view
   */
  _switchOverviewPageDisplay(): void {
    this._listViewActive = !this._listViewActive;
    if ('localStorage' in window) {
      this._listViewActive
        ? localStorage.setItem(LOCALSTORAGEKEY, 'list')
        : localStorage.setItem(LOCALSTORAGEKEY, 'tiles');
    }
  }

  /**
   * Create an associative array from all elements,
   * that should be accessible through shortcuts
   */
  private _prepareItems(): void {
    this._shortcutItems = [];

    this._items.forEach(item => {
      // get the first letter
      const firstLetter = item.data.title[0].toLowerCase();

      // use the first letter as key for the array
      if (
        this._shortcutItems[firstLetter] &&
        this._shortcutItems[firstLetter].length
      ) {
        this._shortcutItems[firstLetter] = [
          ...this._shortcutItems[firstLetter],
          item,
        ];
      } else {
        this._shortcutItems[firstLetter] = [item];
      }
    });
  }

  /**
   * focus the first element, that starts with the pressed letter.
   * if the same key is pressed again, focus the next element, that starts
   * with this letter and so on.
   */
  private _focusItem(key: string): void {
    if (key === this._previousKey && document.activeElement !== document.body) {
      this._counter++;
      if (
        this._shortcutItems[key] &&
        this._counter >= this._shortcutItems[key].length
      ) {
        this._counter = this._counter - this._shortcutItems[key].length;
      }
    } else {
      this._counter = 0;
    }

    if (this._shortcutItems[key] && this._shortcutItems[key][this._counter]) {
      this._shortcutItems[key][this._counter].focus();
    }

    this._previousKey = key;
  }
}
