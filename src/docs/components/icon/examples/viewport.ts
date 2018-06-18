import { Injectable, ElementRef } from '@angular/core';
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { map, filter } from 'rxjs/operators';
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
    // We have to wrap it in a closure so we can store the
    // elements visibility
    return (() => {
      let visibility = false;
      return change$
        .pipe(filter((viewportRect) => visibility !== isElementVisible(element, viewportRect)))
        .pipe(map(() => visibility = !visibility));
    })();
  }

  /** Stream that emits when the element enters the viewport */
  elementEnter(el: Element | ElementRef): Observable<boolean> {
    return this.elementVisibility(el)
      .pipe(filter((visibility) => visibility));
  }

  /** Stream that emits when the element leaves the viewport */
  elementLeave(el: Element | ElementRef): Observable<boolean> {
    return this.elementVisibility(el)
      .pipe(filter((visibility) => !visibility));
  }

  /** Returns the viewport's width and height. */
  getViewportSize(): Readonly<{
    width: number;
    height: number;
  }> {
    return this._viewportRuler.getViewportSize();
  }
  /** Gets a ClientRect for the viewport's bounds. */
  getViewportRect(): ClientRect {
    return this._viewportRuler.getViewportRect();
  }

  /** Gets the (top, left) scroll position of the viewport. */
  getViewportScrollPosition(): {
    top: number;
    left: number;
  } {
    return this._viewportRuler.getViewportScrollPosition();
  }

  /** Trigger a custom update on the viewport streams */
  update(context?: Element | ElementRef): void {
    this._refresher.next(context);
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
