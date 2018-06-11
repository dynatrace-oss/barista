import { ViewportRuler } from '@angular/cdk/scrolling';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Default timeout used to throttle window resize events */
const DEFAULT_WINDOW_EVENT_TIMEOUT = 150;

/** Default ViewportResizer implementation that will only react to window size changes */
@Injectable()
export class DtDefaultViewportResizer implements ViewportResizer {

  constructor(private _viewportRuler: ViewportRuler) { }

  /** Returns a stream that emits whenever the size of the viewport changes. */
  change(): Observable<void> {
    return this._viewportRuler.change(DEFAULT_WINDOW_EVENT_TIMEOUT)
      .pipe(map(() => void 0));
  }
}

/** Abstract class so the consumer can implement there own ViewportResizer */
@Injectable({
  providedIn: 'root',
  useClass: DtDefaultViewportResizer,
})
export abstract class ViewportResizer {
  abstract change(): Observable<void>;
}
