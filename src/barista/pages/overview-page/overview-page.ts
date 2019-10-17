import { Component } from '@angular/core';
import { BaPage } from 'pages/page-outlet';
import { BaOverviewPageContents } from 'shared/page-contents';

const LOCALSTORAGEKEY = 'baristaGridview';

@Component({
  selector: 'ba-overview-page',
  templateUrl: 'overview-page.html',
  styleUrls: ['overview-page.scss'],
})
export class BaOverviewPage implements BaPage {
  contents: BaOverviewPageContents;

  _listViewActive = true;

  constructor() {
    if ('localStorage' in window) {
      const localStorageState = localStorage.getItem(LOCALSTORAGEKEY);
      this._listViewActive = localStorageState !== 'tiles';
    }
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
