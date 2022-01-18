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

import { OverlayRef } from '@angular/cdk/overlay';
import { NgZone } from '@angular/core';
import {
  EMPTY,
  Observable,
  Subject,
  Subscription,
  fromEvent,
  interval,
  merge,
} from 'rxjs';
import { mapTo, scan, startWith, switchMap, takeWhile } from 'rxjs/operators';

import { DT_TOAST_CHAR_READ_TIME } from './toast-config';
import { DtToastContainer } from './toast-container';

export class DtToastRef {
  /** The instance for the toast-container that holds the message */
  containerInstance: DtToastContainer;

  /** The duration the toastref will be displayed */
  duration: number;

  /** Obersable that emits when the dismiss timer should be paused */
  private _pause$: Observable<boolean>;
  /** Observable that emits whenever the dismiss timer should be resumed */
  private _resume$: Observable<boolean>;
  /** Observable that emits everytime someone can read a char */
  private _interval$: Observable<number>;
  /** The subscription of the countdown */
  private _countdownSub = Subscription.EMPTY;

  private readonly _afterDismissed = new Subject<void>();

  constructor(
    containerInstance: DtToastContainer,
    duration: number,
    private _overlayRef: OverlayRef,
    private _zone: NgZone,
  ) {
    this.containerInstance = containerInstance;
    this.duration = duration;
    containerInstance._onDomExit.subscribe(() => {
      this._overlayRef.dispose();
      this._countdownSub.unsubscribe();
      this._afterDismissed.next();
      this._afterDismissed.complete();
    });
    this._interval$ = interval(DT_TOAST_CHAR_READ_TIME).pipe(
      mapTo(-DT_TOAST_CHAR_READ_TIME),
    );
    this._pause$ = fromEvent(
      this.containerInstance._elementRef.nativeElement,
      'mouseenter',
    ).pipe(mapTo(false));
    this._resume$ = fromEvent(
      this.containerInstance._elementRef.nativeElement,
      'mouseleave',
    ).pipe(mapTo(true));
  }

  /** Observable that emits when the toast finished the dismissal */
  afterDismissed(): Observable<void> {
    return this._afterDismissed.asObservable();
  }

  /** Observable that emits when the toast has finished the enter animation */
  afterOpened(): Observable<void> {
    return this.containerInstance._onEnter;
  }

  /** Dismisses the toast */
  dismiss(): void {
    if (!this._afterDismissed.closed) {
      this.containerInstance.exit();
    }
    this._countdownSub.unsubscribe();
  }

  /**
   * @internal
   * Starts a timer to dismiss the toast automatically after the duration is over.
   * Handles pausing and resuming the timer.
   */
  _dismissAfterTimeout(): void {
    this._zone.runOutsideAngular(() => {
      this._countdownSub = merge(this._pause$, this._resume$)
        .pipe(
          startWith(true),
          switchMap((val) => (val ? this._interval$ : EMPTY)),
          scan((acc, curr) => (curr ? curr + acc : acc), this.duration),
          takeWhile((v) => v >= DT_TOAST_CHAR_READ_TIME),
        )
        .subscribe({
          complete: () => {
            this._zone.run(() => {
              this.dismiss();
            });
          },
        });
    });
  }
}
