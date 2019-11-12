import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';

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
  subheadlines?: BaTocItem[];
  hasSubheadlines?: boolean;
  headlineId: string;
}

@Injectable()
export class BaTocService {
  /** the list of toc items */
  tocList = new ReplaySubject<BaTocItem[]>(1);
  /** the currently active toc item */
  activeItem = new ReplaySubject<Element>(1);
  /** all toc items */
  tocItems: BaTocItem[];

  private _scrollSpyInfo: BaScrollSpyInfo | null = null;

  constructor(
    // tslint:disable-next-line: no-any
    @Inject(DOCUMENT) private document: any,
    private _scrollSpyService: BaScrollSpyService,
  ) {}

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

    // start the scroll spy
    this._scrollSpyInfo = this._scrollSpyService.spyOn(headlines);
    this._scrollSpyInfo.active.subscribe(item => {
      if (item) {
        this.activeItem.next(item.element);
      }
    });
  }

  /** refractor the headlines (add all h2s and add the h3s as subheadlines to the matching h2) */
  private _refractorTocItems(
    headlines: HTMLHeadingElement[],
    docId: string,
  ): BaTocItem[] {
    const idMap = new Map<string, number>();
    const toc: BaTocItem[] = [];
    let subheadlinesArray: BaTocItem[] = [];
    let previousH2;

    for (const headline of headlines) {
      if (headline.tagName.toLowerCase() === 'h2') {
        if (previousH2) {
          toc.push(
            this._createEntry(previousH2, docId, idMap, subheadlinesArray),
          );
          subheadlinesArray = [];
          previousH2 = headline;
        } else {
          previousH2 = headline;
        }
      } else {
        subheadlinesArray.push(
          this._createEntry(headline, docId, idMap, subheadlinesArray),
        );
      }
    }

    if (previousH2) {
      toc.push(this._createEntry(previousH2, docId, idMap, subheadlinesArray));
    }

    return toc;
  }

  /** create a toc entry for a given headline */
  private _createEntry(
    heading: HTMLHeadingElement,
    docId: string,
    idMap: Map<string, number>,
    subheadlinesArray?: BaTocItem[],
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
    const div: HTMLDivElement = this.document.createElement('div');
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
    return querySelectorAll<HTMLHeadingElement>(docElement, 'h2,h3');
  }

  /** reset the scrollspyinfo if it exists */
  private _resetScrollSpyInfo(): void {
    if (this._scrollSpyInfo) {
      this._scrollSpyInfo.unspy();
      this._scrollSpyInfo = null;
    }

    this.activeItem.next(undefined);
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
