import { Provider, Optional, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { merge } from 'rxjs/operators/merge';
import { map } from 'rxjs/operators/map';

/** Default timeout used to throttle window resize events */
const DEFAULT_WINDOW_EVENT_TIMEOUT = 150;

/** ViewportSize object containing information about the viewport */
export type ViewportSize = Readonly<{
  width: number;
  height: number;
}>;

/** Abstract class so the consumer can implement there own ViewportResizer */
export abstract class ViewportResizer {
  abstract emit(): void;
  abstract change(throttleTime?: number): Observable<ViewportSize>;
}

/** Default ViewportResizer implementation */
export class DefaultViewportResizer implements ViewportResizer {

  private _refesher = new Subject<void>();

  constructor(private _viewportRuler: ViewportRuler) { }

  /** emits an event that the viewport resized */
  emit(): void {
    this._refesher.next();
  }

  /** Returns a stream that emits whenever the size of the viewport changes. */
  change(throttleTime: number = DEFAULT_WINDOW_EVENT_TIMEOUT): Observable<ViewportSize> {
    return this._viewportRuler.change(throttleTime)
      .pipe(merge(this._refesher))
      .pipe(map(() => this._viewportRuler.getViewportSize()));
  }
}

/** ViewportResizer Factory to ensure a singleton, can set the timeout for window resize events */
function VIEWPORT_RESIZER_FACTORY(
  viewportRuler: ViewportRuler,
  parentResizer?: ViewportResizer,
  throttleTime: number = DEFAULT_WINDOW_EVENT_TIMEOUT
): ViewportResizer {
  return parentResizer || new DefaultViewportResizer(viewportRuler);
}

/** Default provider */
export const DEFAULT_VIEWPORT_RESIZER_PROVIDER: Provider = {
  provide: ViewportResizer,
  useFactory: VIEWPORT_RESIZER_FACTORY,
  deps: [ViewportRuler, [new Optional(), new SkipSelf(), ViewportResizer]],
};
