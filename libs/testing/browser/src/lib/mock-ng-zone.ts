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

import { EventEmitter, Injectable, NgZone } from '@angular/core';

/**
 * Mock synchronous NgZone implementation that can be used
 * to flush out `onStable` subscriptions in tests.
 */
@Injectable()
export class MockNgZone extends NgZone {
  /** Emits when the zone is stable */
  onStable: EventEmitter<any> = new EventEmitter(false);
  /** Emits when there are no micro tasks */
  onMicrotaskEmpty: EventEmitter<any> = new EventEmitter(false);

  constructor() {
    super({ enableLongStackTrace: false });
  }

  /** Run the ng zone */
  run(fn: () => any): any {
    return fn();
  }

  /** Run fn outside of angular */
  runOutsideAngular(fn: () => any): any {
    return fn();
  }

  /** Simulates zone exit */
  simulateZoneExit(): void {
    this.onStable.emit(null);
  }

  /** Simulates micro tasks empty */
  simulateMicrotasksEmpty(): void {
    this.onMicrotaskEmpty.emit(null);
  }
}
