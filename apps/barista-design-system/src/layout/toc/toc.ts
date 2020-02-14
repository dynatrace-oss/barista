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

import {
  Component,
  ViewChildren,
  OnInit,
  AfterViewInit,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { BaTocService, BaTocItem } from '../../shared/toc.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ba-toc',
  templateUrl: 'toc.html',
  styleUrls: ['toc.scss'],
  host: {
    class: 'ba-toc',
  },
})
export class BaToc implements OnInit, AfterViewInit, OnDestroy {
  /** @internal all TOC entries */
  @ViewChildren('headline') _headlines;

  /** @internal whether the TOC is expanded  */
  _expandToc: boolean;
  /** @internal all headlines, which should be represented in the TOC  */
  _headings: BaTocItem[] = [];
  /** @internal the TOC entries that are currently active */
  _activeItems: BaTocItem[] = [];

  /** Subscription on the current TOC list */
  private _tocListSubscription = Subscription.EMPTY;
  /** Subscription on active TOC items */
  private _activeItemsSubscription = Subscription.EMPTY;

  constructor(private _tocService: BaTocService, private _zone: NgZone) {}

  ngOnInit(): void {
    this._tocListSubscription = this._tocService.tocList.subscribe(headings => {
      this._headings = headings;
    });

    this._activeItemsSubscription = this._tocService.activeItems.subscribe(
      activeItems => {
        this._zone.run(() => {
          this._activeItems = activeItems;
        });
      },
    );
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      const docElement = document.getElementById('main') || undefined;
      this._tocService.genToc(docElement);
    });
  }

  ngOnDestroy(): void {
    this._tocListSubscription.unsubscribe();
    this._activeItemsSubscription.unsubscribe();
  }

  /** @internal toggle the expandable menu */
  _expandTocMenu(): void {
    this._expandToc = !this._expandToc;
  }

  /** @internal handle the click on a TOC item */
  _handleTocClick(ev: MouseEvent): void {
    /* Preventing the default behavior is necessary, because on Angular component pages
     * there's a base URL defined and the on-page-links are always relative to "/"
     * and not to the current page. */
    ev.preventDefault();
    ev.stopImmediatePropagation();
    const targetId = (ev.currentTarget as HTMLElement).getAttribute('href');
    const target = document.querySelector(targetId || '');

    if (target) {
      // Has to be set manually because of preventDefault() above.
      window.location.hash = targetId || '';
      requestAnimationFrame(() => {
        target.scrollIntoView({
          behavior: 'smooth',
        });
      });
    }
  }
}
