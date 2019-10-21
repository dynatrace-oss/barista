import { A, Z } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  Component,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { BaPage } from 'pages/page-outlet';
import { fromEvent } from 'rxjs';
import { BaOverviewPageContents } from 'shared/page-contents';

import { readKeyCode } from '@dynatrace/angular-components/core';

import { BaTile } from '../../layout/tile/tile';

const LOCALSTORAGEKEY = 'baristaGridview';

@Component({
  selector: 'ba-overview-page',
  templateUrl: 'overview-page.html',
  styleUrls: ['overview-page.scss'],
})
export class BaOverviewPage implements AfterViewInit, BaPage {
  contents: BaOverviewPageContents;

  _listViewActive = true;
  private _previousKey: string;
  private _counter = 0;
  private _shortcutItems = [];

  @ViewChildren(BaTile) _items: QueryList<BaTile>;

  constructor() {
    if ('localStorage' in window) {
      const localStorageState = localStorage.getItem(LOCALSTORAGEKEY);
      this._listViewActive = localStorageState !== 'tiles';
    }
  }

  ngAfterViewInit(): void {
    this._prepareItems();

    fromEvent(document, 'keyup').subscribe((evt: KeyboardEvent) => {
      const keyCode = readKeyCode(evt);
      if (keyCode >= A && keyCode <= Z) {
        this._focusItem(evt.key.toLowerCase());
      }
    });
  }

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

  private _focusItem(key: string): void {
    if (key === this._previousKey) {
      if (document.activeElement === document.body) {
        this._counter = 0;
      } else {
        this._counter++;
        if (
          this._shortcutItems[key] &&
          this._counter >= this._shortcutItems[key].length
        ) {
          this._counter = this._counter - this._shortcutItems[key].length;
        }
      }
    } else {
      this._counter = 0;
    }

    if (this._shortcutItems[key] && this._shortcutItems[key][this._counter]) {
      this._shortcutItems[key][this._counter].focus();
    }

    this._previousKey = key;
  }

  _switchOverviewPageDisplay(): void {
    this._listViewActive = !this._listViewActive;
    if ('localStorage' in window) {
      this._listViewActive
        ? localStorage.setItem(LOCALSTORAGEKEY, 'list')
        : localStorage.setItem(LOCALSTORAGEKEY, 'tiles');
    }
  }
}
