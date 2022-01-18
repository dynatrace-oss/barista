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
import { A, Z } from '@angular/cdk/keycodes';
import { Platform } from '@angular/cdk/platform';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  QueryList,
  ViewChildren,
  Inject,
} from '@angular/core';
import { _readKeyCode } from '@dynatrace/barista-components/core';
import { fromEvent, Subscription } from 'rxjs';
import { DsPageService } from '@dynatrace/shared/design-system/ui';
import { BaTile } from './components/tile';
import { DOCUMENT } from '@angular/common';
import { BaCategoryNavigation } from '@dynatrace/shared/design-system/interfaces';

const LOCALSTORAGEKEY = 'baristaGridview';

@Component({
  selector: 'ba-overview-page',
  templateUrl: 'overview-page.html',
  styleUrls: ['overview-page.scss'],
  host: {
    class: 'ba-page',
  },
})
export class BaOverviewPage implements AfterViewInit, OnDestroy {
  content = this._pageService._getCurrentPage() as BaCategoryNavigation;

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

  constructor(
    private _platform: Platform,
    private _pageService: DsPageService,
    @Inject(DOCUMENT) private _document: any,
  ) {
    // check the local storage and set the initial value for the display of the tiles
    if (this._platform.isBrowser && 'localStorage' in window) {
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
    this._keyUpSubscription = fromEvent(this._document, 'keyup').subscribe(
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
    if (this._platform.isBrowser && 'localStorage' in window) {
      if (this._listViewActive) {
        localStorage.setItem(LOCALSTORAGEKEY, 'list');
      } else {
        localStorage.setItem(LOCALSTORAGEKEY, 'tiles');
      }
    }
  }

  /**
   * Create an associative array from all elements,
   * that should be accessible through shortcuts
   */
  private _prepareItems(): void {
    this._shortcutItems = [];

    this._items.forEach((item) => {
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
    if (
      key === this._previousKey &&
      this._document.activeElement !== this._document.body
    ) {
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

  isComponentPreview(title: string | undefined): boolean {
    if (title && title === 'Components') {
      return true;
    }
    return false;
  }
}
