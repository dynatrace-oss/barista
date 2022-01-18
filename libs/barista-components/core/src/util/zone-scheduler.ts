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
import { SchedulerLike, Subscription, asyncScheduler } from 'rxjs';

/** @internal Abstract implementation of the Zone scheduler */
abstract class ZoneScheduler implements SchedulerLike {
  constructor(protected _ngZone: NgZone, protected _scheduler: SchedulerLike) {}

  /** Schedules a execution context to run */
  abstract schedule(...args: unknown[]): Subscription;

  /** Triggers the scheduler to run the execution context */
  now(): number {
    return this._scheduler.now();
  }
}

/** @internal Scheduler that runs the provided execution task outside the Angular zone */
class RunOutsideZoneScheduler extends ZoneScheduler {
  /** Wraps the execution context to run outside the Angular zone */
  schedule(...args: unknown[]): Subscription {
    return this._ngZone.runOutsideAngular(() =>
      // eslint-disable-next-line prefer-spread
      this._scheduler.schedule.apply(this._scheduler, args),
    );
  }
}

/** @internal Scheduler that runs the provided execution task inside the Angular zone */
class RunInsideZoneScheduler extends ZoneScheduler {
  /** Wraps the execution context to run inside the angular zone */
  schedule(...args: unknown[]): Subscription {
    return this._ngZone.run(() =>
      // eslint-disable-next-line prefer-spread
      this._scheduler.schedule.apply(this._scheduler, args),
    );
  }
}

/**
 * Scheduler that runs the provided execution task outside the Angular zone
 *
 * @param ngZone The Angular Zone that has to be provided
 * @param scheduler A scheduler that should be taken to schedule the execution Context.
 * Default it uses the async scheduler.
 *
 * @example
 *
 * // Wrap all around a run outside Angular
 * this.zone.runOutsideAngular(() => {
 *   of('test').subscribe(...);
 * });
 *
 * const test$ = of('test').pipe(
 *  observeOn(runOutsideZone(this._zone)),
 * );
 *
 * // Wrap The subscribe in run outside Angular
 * of('test').subscribe((v) => {
 *   this.zone.runOutsideAngular(() => {
 *     console.log(v);
 *   });
 * });
 *
 * const test$ = of('test').pipe(
 *  subscribeOn(runOutsideZone(this._zone)),
 * ).subscribe((v) => console.log(v))
 */
export function runOutsideZone(
  ngZone: NgZone,
  scheduler: SchedulerLike = asyncScheduler,
): SchedulerLike {
  return new RunOutsideZoneScheduler(ngZone, scheduler);
}

/**
 * Scheduler that runs the provided execution task inside the Angular zone
 *
 * @param ngZone The Angular Zone that has to be provided
 * @param scheduler A scheduler that should be taken to schedule the execution Context.
 * Default it uses the async scheduler.
 *
 * @example
 *
 * // Wrap all around a zone run inside Angular
 * this.zone.run(() => {
 *   of('test').subscribe(...);
 * });
 *
 * const test$ = of('test').pipe(
 *  observeOn(runInsideZone(this._zone)),
 * );
 *
 * // Wrap The subscribe in a zone run
 * of('test').subscribe((v) => {
 *   this.zone.run(() => {
 *     console.log(v);
 *   });
 * });
 *
 * const test$ = of('test').pipe(
 *  subscribeOn(runInsideZone(this._zone)),
 * )
 */
export function runInsideZone(
  ngZone: NgZone,
  scheduler: SchedulerLike = asyncScheduler,
): SchedulerLike {
  return new RunInsideZoneScheduler(ngZone, scheduler);
}
