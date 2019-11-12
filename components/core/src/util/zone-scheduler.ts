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
      this._scheduler.schedule.apply(this._scheduler, args),
    );
  }
}

/** @internal Scheduler that runs the provided execution task inside the Angular zone */
class RunInsideZoneScheduler extends ZoneScheduler {
  /** Wraps the execution context to run inside the angular zone */
  schedule(...args: unknown[]): Subscription {
    return this._ngZone.run(() =>
      this._scheduler.schedule.apply(this._scheduler, args),
    );
  }
}

/**
 * Scheduler that runs the provided execution task outside the Angular zone
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
