import { AfterViewInit, Directive, ElementRef, HostBinding, Input, Renderer2 } from '@angular/core';
import * as hljs from 'highlight.js';

@Directive({
  selector: '[snippet]',
})
export class SnippetDirective implements AfterViewInit {

  @Input()
  language: string | string[];

  @Input()
  snippet: string;

  @HostBinding('class.hljs')
  hljsClass = 'hljs';

  constructor(private readonly element: ElementRef, private readonly renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    const highlightResult = hljs.highlightAuto(this.snippet || this.element.nativeElement.innerHTML, this.getLanguagesSubset());

    // tslint:disable-next-line:dt-ban-inner-html
    this.element.nativeElement.innerHTML = highlightResult.value;
    this.renderer.addClass(this.element.nativeElement, highlightResult.language);
  }

  private getLanguagesSubset(): string[] {
    if (!this.language) {
      return hljs.listLanguages();
    }
    if (Array.isArray(this.language)) {
      return this.language;
    }
    return [this.language];
  }
}
