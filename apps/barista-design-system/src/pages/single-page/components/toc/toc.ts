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
  Inject,
  Input,
} from '@angular/core';
import {
  BaTocService,
  BaTocItem,
} from '../../../../shared/services/toc.service';
import { Subscription } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { TOC } from '@dynatrace/shared/barista-definitions';

@Component({
  selector: 'ba-toc',
  templateUrl: 'toc.html',
  styleUrls: ['toc.scss'],
  host: {
    class: 'ba-toc',
  },
})
export class BaToc implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  tocitems: TOC;

  /** @internal all TOC entries */
  @ViewChildren('headline') _headlines;

  /** @internal whether the TOC is expanded  */
  _expandToc: boolean;
  /** @internal all headlines, which should be represented in the TOC  */
  _headings$ = this._tocService.tocList;
  /** @internal the TOC entries that are currently active */
  _activeItems: BaTocItem[] = [];

  /** Subscription on active TOC items */
  private _activeItemsSubscription = Subscription.EMPTY;

  constructor(
    private _tocService: BaTocService,
    private _zone: NgZone,
    private _platform: Platform,
    @Inject(DOCUMENT) private _document: any,
  ) {}

  ngOnInit(): void {
    this._activeItemsSubscription = this._tocService.activeItems.subscribe(
      (activeItems) => {
        this._zone.run(() => {
          this._activeItems = activeItems;
        });
      },
    );
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      const docElement = this._document.getElementById('main') || undefined;
      this._tocService.genToc(docElement);
    });
  }

  ngOnDestroy(): void {
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
    const target = this._document.querySelector(targetId || '');

    if (this._platform.isBrowser && target) {
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
