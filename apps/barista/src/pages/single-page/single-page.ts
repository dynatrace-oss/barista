import { AfterViewInit, Component } from '@angular/core';

import { BaPage } from '../page-outlet';
import { BaRecentlyOrderedService } from '../../shared/recently-ordered.service';
import { BaSinglePageContents } from '../../shared/page-contents';

@Component({
  selector: 'ba-single-page',
  templateUrl: 'single-page.html',
})
export class BaSinglePage implements BaPage, AfterViewInit {
  get contents(): BaSinglePageContents {
    return this._contents;
  }
  set contents(value: BaSinglePageContents) {
    this._contents = value;
    this._recentlyOrderedService.saveToLocalStorage(this.contents);
  }

  private _contents: BaSinglePageContents;

  constructor(private _recentlyOrderedService: BaRecentlyOrderedService) {}

  ngAfterViewInit(): void {
    this._recentlyOrderedService.saveToLocalStorage(this.contents);
  }
}
