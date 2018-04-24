import {Provider, Optional, SkipSelf} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ViewportRuler} from '@angular/cdk/scrolling';
import {map} from 'rxjs/operators/map';

/** Default timeout used to throttle window resize events */
const DEFAULT_WINDOW_EVENT_TIMEOUT = 150;

/** Abstract class so the consumer can implement there own ViewportResizer */
export abstract class ViewportResizer {
  abstract change(): Observable<void>;
}

/** Default ViewportResizer implementation that will only react to window size changes */
export class DefaultViewportResizer implements ViewportResizer {

  constructor(private _viewportRuler: ViewportRuler) { }

  /** Returns a stream that emits whenever the size of the viewport changes. */
  change(): Observable<void> {
    return this._viewportRuler.change(DEFAULT_WINDOW_EVENT_TIMEOUT)
      .pipe(map(() => void 0));
  }
}

/** ViewportResizer Factory to ensure a singleton, can set the timeout for window resize events */
function DEFAULT_VIEWPORT_RESIZER_FACTORY(
  viewportRuler: ViewportRuler,
  parentResizer?: ViewportResizer
): ViewportResizer {
  return parentResizer || new DefaultViewportResizer(viewportRuler);
}

/** Default provider */
export const DEFAULT_VIEWPORT_RESIZER_PROVIDER: Provider = {
  provide: ViewportResizer,
  useFactory: DEFAULT_VIEWPORT_RESIZER_FACTORY,
  deps: [ViewportRuler, [new Optional(), new SkipSelf(), ViewportResizer]],
};
