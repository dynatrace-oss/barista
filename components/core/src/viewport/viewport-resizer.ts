import { ViewportRuler } from '@angular/cdk/scrolling';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Default timeout used to throttle window resize events */
const DEFAULT_WINDOW_EVENT_TIMEOUT = 150;

/** Default ViewportResizer implementation that will only react to window size changes */
@Injectable()
// tslint:disable-next-line
export class DtDefaultViewportResizer implements DtViewportResizer {
  constructor(private _viewportRuler: ViewportRuler) {}

  /** Returns a stream that emits whenever the size of the viewport changes. */
  change(): Observable<void> {
    return this._viewportRuler
      .change(DEFAULT_WINDOW_EVENT_TIMEOUT)
      .pipe(map(() => void 0));
  }

  /** Retrieves the current offset of the viewport */
  getOffset(): { left: number; top: number } {
    return { left: 0, top: 0 };
  }

  /** Event emitted when the viewport size changes with the updated value */
  get offset$(): Observable<{ left: number; top: number }> {
    return this.change().pipe(map(() => this.getOffset()));
  }
}

/** Abstract class so the consumer can implement there own ViewportResizer */
@Injectable({
  providedIn: 'root',
  useClass: DtDefaultViewportResizer,
  deps: [ViewportRuler],
})
export abstract class DtViewportResizer {
  /** Event emitted when the viewport size changes. */
  abstract change(): Observable<void>;

  /**
   * Retrieves the current offset of the viewport
   *
   * @breaking-change Make abstract in 5.0.0
   */
  getOffset(): { left: number; top: number } {
    return { left: 0, top: 0 };
  }

  /**
   * Event emitted when the viewport size changes with the updated value
   *
   * @breaking-change Make abstract in 5.0.0
   */
  get offset$(): Observable<{ left: number; top: number }> {
    return EMPTY;
  }
}
