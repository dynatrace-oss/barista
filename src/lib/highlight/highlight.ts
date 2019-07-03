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
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { addCssClass } from '@dynatrace/angular-components/core';
import { take } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

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

/** Escapes all characters that could be dangerous for a regular expression */
function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
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
  @ViewChild('source', { static: true })
  _sourceElement: ElementRef<HTMLElement>;

  /** @internal */
  @ViewChild('transformed', { static: true })
  _transformedElement: ElementRef<HTMLElement>;

  constructor(
    private _renderer: Renderer2,
    private _zone: NgZone,
    @Inject(PLATFORM_ID) private _platformId: string
  ) {}

  /** Highlight if either the term or the caseSensitive input changes. */
  ngOnChanges(): void {
    this._highlight();
  }

  /** Highlight if the content of the highlight component changes. */
  ngAfterContentChecked(): void {
    this._zone.onMicrotaskEmpty.pipe(take(1)).subscribe(() => {
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
    if (isPlatformBrowser(this._platformId)) {
      return this._sourceElement.nativeElement.innerHTML.trim();
    }
    return undefined;
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

  /**
   * The transform function wraps all occurrences of the provided string
   * in inline elements that are highlighted.
   */
  private _transformAndDisplay(content: string): void {
    let textTokens = [content];

    if (this.term && this.term.length) {
      const flags = this._caseSensitive ? 'gm' : 'gmi';
      const regExp = new RegExp(`(${escapeRegExp(this.term)})`, flags);
      textTokens = content.split(regExp).filter((s) => s.length);
    }

    const max = textTokens.length;

    for (let i = 0; i < max; i += 1) {
      const node = textTokens[i];
      const text = this._renderer.createText(node);

      if (node.toLowerCase() === (this.term && this.term.toLowerCase())) {
        const span = this._renderer.createElement(HIGHLIGHTED_ELEMENT);
        addCssClass(span, HIGHLIGHTED_CLASS);
        // append the created span with the class
        this._renderer.appendChild(span, text);
        this._renderer.appendChild(
          this._transformedElement.nativeElement,
          span
        );
      } else {
        this._renderer.appendChild(
          this._transformedElement.nativeElement,
          text
        );
      }
    }
  }
}
