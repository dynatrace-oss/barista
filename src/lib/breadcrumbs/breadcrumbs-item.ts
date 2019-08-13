import { Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * A breadcrumbs item that can be used within the `<dt-breadcrumbs>`.
 *
 *  @example
 *  <a dtBreadcrumbsItem href="/hosts">Hosts</a>
 */
@Directive({
  selector: 'a[dt-breadcrumbs-item], a[dtBreadcrumbsItem]',
  exportAs: 'dtBreadcrumbsItem',
  host: {
    class: 'dt-breadcrumbs-item',
  },
})
export class DtBreadcrumbsItem2 {
  constructor(
    private readonly _elementRef: ElementRef<HTMLAnchorElement>,
    private readonly _renderer: Renderer2,
  ) {}

  /** @internal */
  _setCurrent(current: boolean): void {
    if (current) {
      this._renderer.setAttribute(
        this._elementRef.nativeElement,
        'aria-current',
        'page',
      );
    } else {
      this._renderer.removeAttribute(
        this._elementRef.nativeElement,
        'aria-current',
      );
    }
  }
}
