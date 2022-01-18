/**
 * @license
 * Copyright 2021 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ViewportRuler } from '@angular/cdk/scrolling';
import { Injectable, Optional, SkipSelf } from '@angular/core';
import { merge, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

/** Default timeout used to throttle window resize events */
const DEFAULT_WINDOW_EVENT_TIMEOUT = 150;

/** Default ViewportResizer implementation that will only react to window size changes */
@Injectable()
// eslint-disable-next-line
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
   */
  abstract getOffset(): { left: number; top: number };

  /**
   * Event emitted when the viewport size changes with the updated value
   */
  abstract get offset$(): Observable<{ left: number; top: number }>;
}

@Injectable()
export class DtTriggerableViewportResizer implements DtViewportResizer {
  constructor(
    @SkipSelf() @Optional() private _originalViewportResizer: DtViewportResizer,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _resizerSubject$ = new Subject<any>();

  /** Returns a stream that emits whenever the size of the viewport changes. */
  change(): Observable<void> {
    if (this._originalViewportResizer) {
      return merge(
        this._originalViewportResizer.change(),
        this._resizerSubject$.asObservable(),
      );
    }
    return this._resizerSubject$.asObservable();
  }

  /** Retrieves the current offset of the viewport */
  getOffset(): { left: number; top: number } {
    return { left: 0, top: 0 };
  }

  /** Event emitted when the viewport size changes with the updated value */
  get offset$(): Observable<{ left: number; top: number }> {
    return this.change().pipe(map(() => this.getOffset()));
  }

  trigger(): void {
    this._resizerSubject$.next();
  }
}
