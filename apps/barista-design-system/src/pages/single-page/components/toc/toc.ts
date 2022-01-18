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

import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';
import { TableOfContents } from '@dynatrace/shared/design-system/interfaces';
import { BaScrollSpyService } from '../../../../shared/services/scroll-spy.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ba-toc',
  templateUrl: 'toc.html',
  styleUrls: ['toc.scss'],
  host: {
    class: 'ba-toc',
  },
})
export class BaToc implements OnInit, OnDestroy {
  /** Contains the toc items of the page, coming from page-content component */
  @Input()
  tocItems: TableOfContents[];

  /** @internal whether the TOC is expanded  */
  _expandToc: boolean;

  /** @internal the TOC items that are currently active */
  _activeItems: TableOfContents[] = [];

  private _scrollSpySubscription: Subscription = Subscription.EMPTY;

  constructor(
    private _scrollSpyService: BaScrollSpyService,
    private _location: Location,
    @Inject(DOCUMENT) private _document: any,
  ) {}

  ngOnInit(): void {
    const headlines = [].slice.call(
      this._document.querySelectorAll(
        '.ba-single-page-content h2, .ba-single-page-content h3',
      ),
    );

    this._scrollSpySubscription = this._scrollSpyService
      .spyOn(headlines)
      .subscribe((activeItemId) => {
        this._activeItems = [];
        for (const tocItem of this.tocItems) {
          if (tocItem.id === activeItemId) {
            this._activeItems.push(tocItem);
          }
          if (tocItem.children) {
            for (const tocSubItem of tocItem.children) {
              if (tocSubItem.id === activeItemId) {
                this._activeItems.push(tocItem, tocSubItem);
              }
            }
          }
        }
      });
  }

  ngOnDestroy(): void {
    this._scrollSpySubscription.unsubscribe();
  }

  /** @internal toggle the expandable menu */
  _expandTocMenu(): void {
    this._expandToc = !this._expandToc;
  }

  /** @internal handle the click on a TOC item */
  _handleTocClick(target: string): void {
    this._location.go(`${this._location.path()}#${target}`);
    const targetHeadline = this._document.querySelector(
      `h2[id="${target}"], h3[id="${target}"]`,
    );
    requestAnimationFrame(() => {
      targetHeadline.scrollIntoView({
        behavior: 'smooth',
      });
    });
  }
}
