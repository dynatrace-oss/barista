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

import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/common';
import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Optional,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import {
  _addCssClass,
  createInViewportStream,
} from '@dynatrace/barista-components/core';

const HIGHLIGHTED_CLASS = 'dt-highlight-mark';
const HIGHLIGHTED_ELEMENT = 'mark';

const HTML_CHARS_OVERRIDES: [string, string][] = [
  ['&lt;', '<'],
  ['&gt;', '>'],
  ['&amp;', '&'],
  ['&nbsp;', ' '],
];

/**
 * Helper function to remove all children of a parent node.
 * This can be every dom element.
 */
function removeNodeChildren(parent: Element): void {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/** Escapes all characters that could be dangerous for a regular expression */
function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

@Component({
  selector: 'dt-highlight, [dt-highlight]',
  exportAs: 'dtHighlight',
  host: {
    class: 'dt-highlight',
  },
  templateUrl: 'highlight.html',
  styleUrls: ['highlight.scss'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtHighlight
  implements AfterContentChecked, AfterViewInit, OnChanges, OnDestroy
{
  /**
   * The caseSensitive input can be set to search for case sensitive occurrences.
   * Per default the search is case insensitive.
   */
  @Input()
  get caseSensitive(): boolean {
    return this._caseSensitive;
  }
  set caseSensitive(sensitive: boolean) {
    this._caseSensitive = coerceBooleanProperty(sensitive);
  }
  private _caseSensitive = false;
  static ngAcceptInputType_caseSensitive: BooleanInput;

  /**
   * The term is the string that should be highlighted in the projected content.
   * Every occurrence of the string is going to be highlighted.
   */
  @Input() term = '';

  /** @internal */
  @ViewChild('source', { static: true })
  _sourceElement: ElementRef<HTMLElement>;

  /** @internal */
  @ViewChild('transformed', { static: true })
  _transformedElement: ElementRef<HTMLElement>;

  private _textContent: string | null = null;
  private _isInViewport = false;
  private _isInViewportSubscription = Subscription.EMPTY;

  constructor(
    private _zone: NgZone,
    private _elementRef: ElementRef,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Optional() @Inject(DOCUMENT) private _document?: any,
  ) {}

  /** Highlight if either the term or the caseSensitive input changes. */
  ngOnChanges(): void {
    this._highlight();
  }

  /** Highlight if the content of the highlight component changes. */
  ngAfterContentChecked(): void {
    this._zone.onStable.pipe(take(1)).subscribe(() => {
      // check if the text has actually changed, if not skip the highlight.
      const textContent = this._getTextContent();
      if (textContent !== this._textContent) {
        this._textContent = textContent;
        this._highlight();
      }
    });
  }

  ngAfterViewInit(): void {
    // Initially we need to run and force highlight once
    // to move the text content value into the visible span
    // Otherwise some layouts will be tripped up, as the visible span
    // would be 0x0 pixels large.
    const textContent = this._getTextContent();
    this._textContent = textContent;
    this._highlight(true);

    // Observable whether the component is in the viewport.
    this._isInViewportSubscription = createInViewportStream(
      this._elementRef,
      0,
    ).subscribe((value) => {
      this._isInViewport = value;
      if (value) {
        this._highlight();
      }
    });
  }

  ngOnDestroy(): void {
    this._isInViewportSubscription.unsubscribe();
  }

  /** Get the textContent of the highlight component. */
  private _getTextContent(): string | null {
    // check if we are in a browser context
    if (this._document) {
      let text = this._sourceElement.nativeElement.innerHTML.trim();
      for (const [needle, replacement] of HTML_CHARS_OVERRIDES) {
        text = text.replace(new RegExp(needle, 'g'), replacement);
      }
      return text.length ? text : null;
    }
    return null;
  }

  /** The highlight function triggers the highlighting process if we are in a browser context. */
  private _highlight(force: boolean = false): void {
    // Make sure to only update the highlight if it is in the viewport.
    // This is needed because the highlight component can possibly be
    // rendered a lot if it is used for example in a big data table or autocomplete.
    if (!force && (!this._isInViewport || !this._document)) {
      return;
    }
    // As we create the highlight nodes with browser native functions we do not depend on Angular's CD.
    // So we can run this code outside the zone to boost performance.
    this._zone.runOutsideAngular(() => {
      const textContent = this._textContent;
      const term = this.term;
      const transformedEl = this._transformedElement.nativeElement;

      // Remove the old nodes.
      removeNodeChildren(transformedEl);
      if (textContent !== null && Boolean(term && term.length)) {
        const flags = this._caseSensitive ? 'gm' : 'gmi';
        const regExp = new RegExp(`(${escapeRegExp(term)})`, flags);
        const textTokens = textContent.split(regExp).filter((s) => s.length);

        for (const token of textTokens) {
          const text = this._document.createTextNode(token);

          if (token.toLowerCase() === term.toLowerCase()) {
            const span = this._document.createElement(HIGHLIGHTED_ELEMENT);
            _addCssClass(span, HIGHLIGHTED_CLASS);
            span.appendChild(text);
            transformedEl.appendChild(span);
          } else {
            transformedEl.appendChild(text);
          }
        }
      } else if (textContent !== null) {
        transformedEl.appendChild(this._document.createTextNode(textContent));
      }
    });
  }
}
