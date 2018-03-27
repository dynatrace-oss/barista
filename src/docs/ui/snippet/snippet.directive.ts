import { AfterViewInit, Directive, ElementRef, HostBinding, Input, Renderer2 } from '@angular/core';
import * as hljs from 'highlight.js';

@Directive({
  selector: '[snippet]',
})
export class SnippetDirective implements AfterViewInit {

  @Input('language')
  language: string | string[];

  @Input()
  snippet: string;

  @HostBinding('class.hljs')
  hljsClass = 'hljs';

  constructor(private readonly element: ElementRef, private readonly renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    const languages = this.language ? Array.from(this.language) : hljs.listLanguages();
    const highlightResult = hljs.highlightAuto(this.snippet || this.element.nativeElement.innerHTML, languages);

    this.element.nativeElement.innerHTML = highlightResult.value;
    this.renderer.addClass(this.element.nativeElement, highlightResult.language);
  }
}
