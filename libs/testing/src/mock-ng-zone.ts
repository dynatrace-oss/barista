/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

import { EventEmitter, Injectable, NgZone } from '@angular/core';

/**
 * Mock synchronous NgZone implementation that can be used
 * to flush out `onStable` subscriptions in tests.
 */
@Injectable()
export class MockNgZone extends NgZone {
  // tslint:disable-next-line:no-any
  onStable: EventEmitter<any> = new EventEmitter(false);
  onMicrotaskEmpty: EventEmitter<any> = new EventEmitter(false);

  constructor() {
    super({ enableLongStackTrace: false });
  }

  // tslint:disable-next-line:no-any
  run(fn: () => any): any {
    return fn();
  }

  // tslint:disable-next-line:no-any
  runOutsideAngular(fn: () => any): any {
    return fn();
  }

  simulateZoneExit(): void {
    this.onStable.emit(null);
  }

  simulateMicrotasksEmpty(): void {
    this.onMicrotaskEmpty.emit(null);
  }
}
