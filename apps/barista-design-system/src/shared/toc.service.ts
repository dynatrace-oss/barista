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

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy, NgZone } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ReplaySubject, Subscription } from 'rxjs';

import { BaScrollSpyInfo, BaScrollSpyService } from './scroll-spy.service';

/**
 * CODE COPIED FROM: 'https://github.com/angular/angular/blob/master/aio/src/app/shared/toc.service.ts' and modified
 */

export interface BaTocItem {
  content: SafeHtml;
  href: string;
  isSecondary?: boolean;
  level: string;
  title: string;
  subheadlines: BaTocItem[];
  hasSubheadlines?: boolean;
  headlineId: string;
}

@Injectable()
export class BaTocService implements OnDestroy {
  /** the list of toc items */
  tocList = new ReplaySubject<BaTocItem[]>(1);
  /** the currently active toc item */
  activeItems = new ReplaySubject<BaTocItem[]>(1);
  /** all toc items */
  tocItems: BaTocItem[];

  private _scrollSpyInfo: BaScrollSpyInfo | null = null;

  /** Subscription on active items coming from scroll spy. */
  private _activeItemSubscription = Subscription.EMPTY;

  constructor(
    // tslint:disable-next-line: no-any
    @Inject(DOCUMENT) private _document: any,
    private _scrollSpyService: BaScrollSpyService,
    private _zone: NgZone,
  ) {}

  ngOnDestroy(): void {
    this._activeItemSubscription.unsubscribe();
  }

  /**
   * generate the toc and start the scroll spy to find the currently active toc item
   */
  genToc(docElement?: Element, docId: string = ''): void {
    this._resetScrollSpyInfo();

    if (!docElement) {
      this.tocList.next([]);
      return;
    }

    const headlines = this._findTocHeadings(docElement);
    this.tocItems = this._refractorTocItems(headlines, docId);
    this.tocList.next(this.tocItems);

    this._zone.runOutsideAngular(() => {
      // start the scroll spy
      this._scrollSpyInfo = this._scrollSpyService.spyOn(headlines);
    });
    this._activeItemSubscription = this._scrollSpyInfo!.active.subscribe(
      scrollItem => {
        if (scrollItem) {
          for (const tocItem of this.tocItems) {
            const scrollItemId = scrollItem.element.getAttribute('id');
            if (tocItem.headlineId === scrollItemId) {
              this.activeItems.next([tocItem]);
            }
            for (const tocSubItem of tocItem.subheadlines) {
              if (tocSubItem.headlineId === scrollItemId) {
                this.activeItems.next([tocItem, tocSubItem]);
              }
            }
          }
        }
      },
    );
  }

  /** refractor the headlines (add all h2s and add the h3s as subheadlines to the matching h2) */
  private _refractorTocItems(
    headlines: HTMLHeadingElement[],
    docId: string,
  ): BaTocItem[] {
    const idMap = new Map<string, number>();
    const toc: BaTocItem[] = [];

    for (const headline of headlines) {
      const item = this._createEntry(headline, docId, idMap, []);

      if (item.level === 'h2') {
        toc.push(item);
      } else if (item.level === 'h3') {
        toc[toc.length - 1].subheadlines.push(item);
        toc[toc.length - 1].hasSubheadlines = true;
      }
    }

    return toc;
  }

  /** create a toc entry for a given headline */
  private _createEntry(
    heading: HTMLHeadingElement,
    docId: string,
    idMap: Map<string, number>,
    subheadlinesArray: BaTocItem[],
  ): BaTocItem {
    const { title, content } = this._extractHeadingSafeHtml(heading);
    const headlineId = `${this._getId(heading, idMap)}`;

    return {
      level: heading.tagName.toLowerCase(),
      href: `${docId}#${headlineId}`,
      headlineId,
      title,
      content,
      subheadlines: subheadlinesArray,
      hasSubheadlines: subheadlinesArray && subheadlinesArray.length > 0,
    };
  }

  /** reset the toc  */
  reset(): void {
    this._resetScrollSpyInfo();
    this.tocList.next([]);
  }

  /**
   * Transform the HTML content to be safe to use in the ToC:
   * - Strip off certain auto-generated elements (such as GitHub links and heading anchor links).
   * - Strip off any anchor links (but keep their content)
   * - Mark the HTML as trusted to be used with 'innerHTML'.
   */
  private _extractHeadingSafeHtml(
    heading: HTMLHeadingElement,
  ): { content: string; title: string } {
    const div: HTMLDivElement = this._document.createElement('div');
    // tslint:disable-next-line: dt-ban-inner-html
    div.innerHTML = heading.innerHTML;

    // Remove any `.github-links` or `.header-link` elements (along with their content).
    querySelectorAll(div, '.github-links, .header-link').forEach(removeNode);

    // Remove any remaining `a` elements (but keep their content).
    for (const anchorLink of querySelectorAll(div, 'a')) {
      // We want to keep the content of this anchor, so move it into its parent.
      const parent = anchorLink.parentNode!;
      while (anchorLink.childNodes.length) {
        parent.insertBefore(anchorLink.childNodes[0], anchorLink);
      }

      // Now, remove the anchor.
      removeNode(anchorLink);
    }

    return {
      content: div.innerHTML.trim(),
      title: (div.textContent || '').trim(),
    };
  }

  /** get all headlines used in the toc */
  private _findTocHeadings(docElement: Element): HTMLHeadingElement[] {
    // Only select direct children of the #all-content wrapper to not
    // select headlines that are part of examples.
    return querySelectorAll<HTMLHeadingElement>(
      docElement,
      '#all-content > h2[id], #all-content > h3[id]',
    );
  }

  /** reset the scrollspyinfo if it exists */
  private _resetScrollSpyInfo(): void {
    if (this._scrollSpyInfo) {
      this._scrollSpyInfo.unspy();
      this._scrollSpyInfo = null;
    }

    this.activeItems.next(undefined);
  }

  /** Extract the id from the heading; create one if necessary */
  private _getId(h: HTMLHeadingElement, idMap: Map<string, number>): string {
    let id = h.id;
    if (id) {
      _addToMap(id);
    } else {
      id = (h.textContent || '')
        .trim()
        .toLowerCase()
        .replace(/\W+/g, '-');
      id = _addToMap(id);
      h.id = id;
    }
    return id;

    // Map guards against duplicate id creation.
    function _addToMap(key: string): string {
      const oldCount = idMap.get(key) || 0;
      const count = oldCount + 1;
      idMap.set(key, count);
      return count === 1 ? key : `${key}-${count}`;
    }
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

function removeNode(node: Node): void {
  if (node.parentNode !== null) {
    node.parentNode.removeChild(node);
  }
}
