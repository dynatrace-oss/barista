import {
  Input,
  ElementRef,
  Renderer2,
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ViewChild,
  AfterContentChecked,
  OnChanges,
  NgZone,
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { addCssClass, isDefined } from '@dynatrace/angular-components/core';
import { take } from 'rxjs/operators';

const HIGHLIGHTED_CLASS = 'dt-highlight-mark';
const HIGHLIGHTED_ELEMENT = 'mark';

/**
 * Helper function to remove all children of a parent node.
 * This can be every dom element.
 */
function removeNodeChildren(parent: Element): void {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

@Component({
  moduleId: module.id,
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
export class DtHighlight implements AfterContentChecked, OnChanges {
  private _caseSensitive = false;
  private _lastTextContent = '';

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

  /**
   * The term is the string that should be highlighted in the projected content.
   * Every occurrence of the string is going to be highlighted.
   */
  @Input() term: string;

  /** @internal */
  @ViewChild('source') _sourceElement: ElementRef<HTMLElement>;

  /** @internal */
  @ViewChild('transformed') _transformedElement: ElementRef<HTMLElement>;

  constructor(private _renderer: Renderer2, private _zone: NgZone) {}

  /** Highlight if either the term or the caseSensitive input changes. */
  ngOnChanges(): void {
    this._highlight();
  }

  /** Highlight if the content of the highlight component changes. */
  ngAfterContentChecked(): void {
    this._zone.onMicrotaskEmpty
      .pipe(take(1))
      .subscribe(() => {
        // check if the text has actually changed, if not skip the highlight.
        const textContent = this._getTextContent();
        if (textContent === this._lastTextContent) {
          return;
        }
        this._highlight(textContent);
      });
  }

  /** Get the textContent of the highlight component. */
  private _getTextContent(): string | undefined {
    // check if we are in a browser context
    if (!document) {
      return undefined;
    }
    return this._sourceElement.nativeElement.innerHTML.trim();
  }

  /** The highlight function triggers the highlighting process if we are in a browser context. */
  private _highlight(content?: string): void {

    const textContent = content || this._getTextContent();
    // clear the transformed element output
    removeNodeChildren(this._transformedElement.nativeElement);

    if (textContent && textContent.length) {
      this._transformAndDisplay(textContent);
      this._lastTextContent = textContent;
    }
  }

  /** Split the incoming text into text tokens by the search term. */
  private _getTextTokens(content: string): string[] {
    const testContent = this._caseSensitive ? content : content.toLowerCase();
    const term = this._caseSensitive ? this.term : this.term.toLowerCase();
    const textTokens: string[] = [];
    let termIndex = testContent.indexOf(term);

    if (termIndex > -1) {
      // If the term is found within the input string, continue searching.
      let cursor = 0;
      while (termIndex > -1) {
        // Push the string between the last found index and the termIndex and move the cursor forward.
        if (termIndex !== 0) {
          textTokens.push(content.slice(cursor, cursor + termIndex));
          cursor = cursor + termIndex;
        }
        // Push the actual matched term and move the cursor forward.
        textTokens.push(content.slice(cursor, cursor + term.length));
        cursor = cursor + term.length;
        // Search the next occurrence of the term in the remainder of the string.
        termIndex = testContent.slice(cursor).indexOf(term);
      }
      // Push the remainder of the content string.
      if (cursor < content.length) {
        textTokens.push(testContent.slice(cursor));
      }
    } else {
      // If the term is not found in the input string, return the whole string as a single token.
      textTokens.push(content);
    }
    return textTokens;
  }

  /**
   * The transform function wraps all occurrences of the provided string
   * in inline elements that are highlighted.
   */
  private _transformAndDisplay(content: string): void {
    // Generate the textTokens to match
    const textTokens = (this.term && this.term.length)
      ? this._getTextTokens(content)
      : [content];

    const max = textTokens.length;
    for (let i = 0; i < max; i += 1) {
      const node = textTokens[i];
      const text = this._renderer.createText(node);

      if (node.toLowerCase() === (this.term && this.term.toLowerCase())) {
        const span = this._renderer.createElement(HIGHLIGHTED_ELEMENT);
        addCssClass(span, HIGHLIGHTED_CLASS);
        // append the created span with the class
        this._renderer.appendChild(span, text);
        this._renderer.appendChild(this._transformedElement.nativeElement, span);
      } else {
        this._renderer.appendChild(this._transformedElement.nativeElement, text);
      }
    }
  }
}
