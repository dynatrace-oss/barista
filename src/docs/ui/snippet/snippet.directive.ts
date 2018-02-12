import { AfterViewInit, Directive, ElementRef, HostBinding, Input, Renderer2 } from "@angular/core";
import * as hljs from "highlight.js";
import { Arrays } from "../../../components";

@Directive({
  selector: "[snippet]",
})
export class SnippetDirective implements AfterViewInit {

  @Input("language")
  public language: string | string[];

  @Input()
  public snippet: string;

  @HostBinding("class.hljs")
  public hljsClass = "hljs";

  public constructor(private readonly element: ElementRef, private readonly renderer: Renderer2) {
  }

  public ngAfterViewInit(): void {
    const languages = this.language ? Arrays.from(this.language) : hljs.listLanguages();
    const highlightResult = hljs.highlightAuto(this.snippet || this.element.nativeElement.innerHTML, languages);

    this.element.nativeElement.innerHTML = highlightResult.value;
    this.renderer.addClass(this.element.nativeElement, highlightResult.language);
  }
}
