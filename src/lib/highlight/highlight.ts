import {
  Input,
  ElementRef,
  Renderer2,
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  AfterContentInit,
  ViewChild,
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { addCssClass, removeNodeChildren } from '@dynatrace/angular-components/core';

const HIGHLIGHTED_CLASS = 'dt-highlight-mark';
const HIGHLIGHTED_ELEMENT = 'mark';

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
export class DtHighlight implements AfterContentInit {

  /**
   * The caseSensitive input can be set to search for case sensitive occurrences.
   * Per default the search is case insensitive.
   */
  @Input()
  get caseSensitive(): boolean { return !this._regularExpressionFlags.has('i'); }
  set caseSensitive(sensitive: boolean) {
    if (!coerceBooleanProperty(sensitive)) {
      this._regularExpressionFlags.add('i');
      return;
    }
    this._regularExpressionFlags.delete('i');
  }

  /**
   * The term is the string that should be highlighted in the projected content.
   * Every occurrence of the string is going to be highlighted.
   */
  @Input()
  get term(): string { return this._term; }
  set term(content: string) {
    this._term = content;
    this._highlight();
  }
  private _term: string;

  /**
   * The regular expression flags are used to search the provided string in a case sensitive or insensitive way
   * The flags for global and multiline are always set
   */
  private _regularExpressionFlags = new Set(['g', 'm', 'i']);

  /** @internal */
  @ViewChild('source') _sourceElement: ElementRef<HTMLElement>;

  /** @internal */
  @ViewChild('transformed') _transformedElement: ElementRef<HTMLElement>;

  constructor(private _renderer: Renderer2) {}

  ngAfterContentInit(): void {
    this._highlight();
  }

  /**
   * @internal
   * The highlight function triggers the highlighting process if we are in a browser context.
   */
  _highlight(): void {
    // check if we are in a browser context
    if (!document) { return; }

    const textContent = this._sourceElement.nativeElement.innerHTML.trim();
    // clear the
    removeNodeChildren(this._transformedElement.nativeElement);

    if (textContent && textContent.length) {
      this._transform(textContent);
    }
  }

  /**
   * The transform function wraps all occurrences of the provided string
   * in inline elements that are highlighted.
   */
  private _transform(content: string): void {
    // joins the modifiers from the set to a string
    const modifiers = Array.from(this._regularExpressionFlags.values()).join('');
    const expression = new RegExp(`(${this._term})`, modifiers);

    const textTokens = this._term.length
      ? content.split(expression)
      : [content];

    // tslint:disable-next-line: one-variable-per-declaration
    for (let i = 0, max = textTokens.length; i < max; i ++) {
      const node = textTokens[i];
      const text = this._renderer.createText(node);

      if (node.toLowerCase() === this._term.toLowerCase()) {
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
