import {
  BaIndexPageContents,
  BaIndexPageItem,
} from '../../shared/page-contents';

import { BaPage } from '../page-outlet';
import { BaRecentlyOrderedService } from '../../shared/recently-ordered.service';
import { Component } from '@angular/core';
import { environment } from './../../environments/environment';

@Component({
  selector: 'ba-index-page',
  templateUrl: 'index-page.html',
  styleUrls: ['index-page.scss'],
})
export class BaIndexPage implements BaPage {
  contents: BaIndexPageContents;

  /** @internal whether the internal content should be displayed */
  _internal = environment.internal;
  /** @internal array of recently visited pages */
  _orderedItems: (BaIndexPageItem | null)[];

  constructor(private _recentlyOrderedService: BaRecentlyOrderedService) {
    this._orderedItems = this._recentlyOrderedService.getRecentlyOrderedItems();
  }
}
