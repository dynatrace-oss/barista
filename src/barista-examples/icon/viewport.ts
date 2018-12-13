import { Injectable, ElementRef } from '@angular/core';
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';
import { Subject, Observable, merge } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Viewport {

  private _refresher = new Subject<undefined | Element | ElementRef>();

  constructor(
    private _scrollDispatcher: ScrollDispatcher,
    private _viewportRuler: ViewportRuler) { }

  /**
   * Stream that emits the ClientRect for the
   * viewport's bounds on every change (includes scroll)
   */
  change(): Observable<ClientRect> {
    return this._change();
  }

  /** Stream that emits when the element enters or leaves the viewport */
  elementVisibility(el: Element | ElementRef): Observable<boolean> {
    const element = asElement(el);
    const change$ = this._change(element);
    return change$
      .pipe(map((viewportRect) => isElementVisible(element, viewportRect)))
      .pipe(distinctUntilChanged());
  }

  /** Stream that emits when the element enters the viewport */
  elementEnter(el: Element | ElementRef): Observable<void> {
    return this.elementVisibility(el)
      .pipe(filter((visibility) => visibility))
      .pipe(map(() => void 0));
  }

  /** Stream that emits when the element leaves the viewport */
  elementLeave(el: Element | ElementRef): Observable<void> {
    return this.elementVisibility(el)
      .pipe(filter((visibility) => !visibility))
      .pipe(map(() => void 0));
  }

  // tslint:disable-next-line:no-any
  private _change(context?: any): Observable<ClientRect> {
    return merge(
      this._scrollDispatcher.scrolled(),
      this._viewportRuler.change(),
      this._refresher.pipe(filter(((ctx) => !ctx || asElement(context) === asElement(ctx))))
    ).pipe(map(() => this._viewportRuler.getViewportRect()));
  }

}

/** Calculates if the element is visible in the viewports Client Rect */
export function isElementVisible(element: Element, viewportRect: ClientRect): boolean {
  const { bottom, top } = element.getBoundingClientRect();
  return bottom >= 0 && top <= viewportRect.height;
}

function asElement(el: Element | ElementRef): Element {
  return el instanceof ElementRef ? el.nativeElement : el;
}
