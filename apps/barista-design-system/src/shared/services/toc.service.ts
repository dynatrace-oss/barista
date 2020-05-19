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

import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';

import { BaScrollSpyInfo, BaScrollSpyService } from './scroll-spy.service';
import { Platform } from '@angular/cdk/platform';
import { TOC } from '@dynatrace/shared/barista-definitions';

/**
 * CODE COPIED FROM: 'https://github.com/angular/angular/blob/master/aio/src/app/shared/toc.service.ts' and modified
 */

@Injectable()
export class BaTocService implements OnDestroy {
  /** the list of toc items */
  tocList = new ReplaySubject<TOC>(1);
  /** the currently active toc item */
  activeItems = new ReplaySubject<TOC>(1);
  /** all toc items */
  tocItems: TOC; // ! Remove

  private _scrollSpyInfo: BaScrollSpyInfo | null = null;

  /** Subscription on active items coming from scroll spy. */
  private _activeItemSubscription = Subscription.EMPTY;

  constructor(
    private _platform: Platform,
    private _scrollSpyService: BaScrollSpyService,
    private _zone: NgZone,
  ) {}

  ngOnDestroy(): void {
    this._activeItemSubscription.unsubscribe();
  }

  /**
   * generate the toc and start the scroll spy to find the currently active toc item
   */
  genToc(docElement?: Element, _docId: string = ''): void {
    this._resetScrollSpyInfo();

    if (!docElement) {
      this.tocList.next();
      return;
    }

    // ! HEADLINES is empty. Selector wrong?
    const headlines = this._findTocHeadings(docElement);
    // debugger;
    console.log(headlines);
    // this.tocItems = this._refractorTocItems(headlines, docId);
    this.tocList.next(this.tocItems);

    // TODO: whole scroll spy logic has to be fixed! It was not refactored
    // during the angular router refactoring
    if (this._platform.isBrowser) {
      this._zone.runOutsideAngular(() => {
        // start the scroll spy
        this._scrollSpyInfo = this._scrollSpyService.spyOn(headlines);
      });
      this._activeItemSubscription = this._scrollSpyInfo!.active.subscribe(
        (scrollItem) => {
          if (scrollItem) {
            for (const tocItem of this.tocItems.headlines) {
              const scrollItemId = scrollItem.element.getAttribute('id');
              if (tocItem.id === scrollItemId) {
                this.activeItems.next({ headlines: [tocItem] });
              }
              if (tocItem.children) {
                for (const tocSubItem of tocItem.children) {
                  if (tocSubItem.id === scrollItemId) {
                    this.activeItems.next({ headlines: [tocItem, tocSubItem] });
                  }
                }
              }
            }
          }
        },
      );
    }
  }

  /** reset the toc  */
  reset(): void {
    this._resetScrollSpyInfo();
    this.tocList.next();
  }

  /** get all headlines used in the toc */
  private _findTocHeadings(docElement: Element): HTMLHeadingElement[] {
    // Only select direct children of the #all-content wrapper to not
    // select headlines that are part of examples.
    return querySelectorAll<HTMLHeadingElement>(
      docElement,
      '#all-content > #headline',
    );
    // '#all-content > h2[id], #all-content > h3[id]',
  }

  /** reset the scrollspyinfo if it exists */
  private _resetScrollSpyInfo(): void {
    if (this._scrollSpyInfo) {
      this._scrollSpyInfo.unspy();
      this._scrollSpyInfo = null;
    }

    this.activeItems.next(undefined);
  }
}

// Helpers
function querySelectorAll<K extends keyof HTMLElementTagNameMap>(
  parent: Element,
  selector: K,
): HTMLElementTagNameMap[K][];
function querySelectorAll<K extends keyof SVGElementTagNameMap>(
  parent: Element,
  selector: K,
): SVGElementTagNameMap[K][];
function querySelectorAll<E extends Element = Element>(
  parent: Element,
  selector: string,
): E[];
function querySelectorAll(parent: Element, selector: string): Element[] {
  // Wrap the `NodeList` as a regular `Array` to have access to array methods.
  return Array.from(parent.querySelectorAll(selector));
}
