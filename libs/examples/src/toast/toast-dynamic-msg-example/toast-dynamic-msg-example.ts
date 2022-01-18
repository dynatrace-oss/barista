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

import { Component } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { DtToast, DtToastRef } from '@dynatrace/barista-components/toast';

const TIMERINTERVAL = 50;

@Component({
  selector: 'dt-example-toast-dynamic-msg',
  templateUrl: 'toast-dynamic-msg-example.html',
})
export class DtExampleToastDynamicMsg {
  message = '';
  toastRef: DtToastRef | null = null;
  elapsedTime: Observable<number>;

  constructor(private _toast: DtToast) {}

  createToast(): void {
    this.toastRef = this._toast.create(this.message);
    if (this.toastRef) {
      this.elapsedTime = timer(0, TIMERINTERVAL).pipe(
        takeUntil(this.toastRef.afterDismissed()),
        map((count: number) => TIMERINTERVAL * count),
      );
    }
  }
}
