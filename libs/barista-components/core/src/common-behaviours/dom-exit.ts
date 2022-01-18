/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import { NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { Constructor } from './constructor';

export interface CanNotifyOnExit {
  readonly _onDomExit: Subject<void>;
  _notifyDomExit(): void;
}

export interface HasNgZone {
  _ngZone: NgZone;
}

/** Mixin to augment a directive with a `disabled` property. */
export function mixinNotifyDomExit<T extends Constructor<HasNgZone>>(
  base: T,
): Constructor<CanNotifyOnExit> & T {
  return class extends base {
    _onDomExit = new Subject<void>();

    _notifyDomExit(): void {
      this._ngZone.onMicrotaskEmpty
        .asObservable()
        .pipe(take(1))
        .subscribe(() => {
          this._onDomExit.next();
          this._onDomExit.complete();
        });
    }

    // eslint-disable-next-line
    constructor(...args: any[]) {
      super(...args);
    }
  };
}
