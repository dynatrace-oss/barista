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

import { EMPTY, Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';
import { ViewportBoundaries } from '../overlay/flexible-connected-position-strategy';
import { DtViewportResizer } from '../viewport';
import { Constructor } from './constructor';

export interface HasViewportBoundaries {
  /** The current viewport boundaries */
  _viewportBoundaries$: Observable<ViewportBoundaries>;
}

export interface HasDestroySubject {
  _destroy$: Subject<void>;
}

export interface HasDtViewportResizer {
  _viewportResizer: DtViewportResizer;
}

/** Mixin to augment a directive with a `viewportBoundaries$` property. */
export function mixinViewportBoundaries<
  T extends Constructor<HasDtViewportResizer>,
>(
  base: T,
): Constructor<HasViewportBoundaries> & Constructor<HasDestroySubject> & T {
  return class extends base {
    _viewportBoundaries$: Observable<ViewportBoundaries> = EMPTY;

    _destroy$ = new Subject<void>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);

      this._viewportBoundaries$ = this._viewportResizer
        ? this._viewportResizer.offset$.pipe(
            startWith({ top: 0, left: 0 }),
            distinctUntilChanged(),
            takeUntil(this._destroy$),
          )
        : of({ left: 0, top: 0 });
    }
  };
}
