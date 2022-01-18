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

import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subscription, interval, Subject } from 'rxjs';
import { take, takeUntil, finalize } from 'rxjs/operators';
import {
  DtTableOrderDataSource,
  DtOrder,
} from '@dynatrace/barista-components/table';

const MAX_ROWS = 5;

@Component({
  selector: 'dt-example-table-observable',
  templateUrl: './table-order-observable-example.html',
})
export class DtExampleTableOrderObservable implements OnInit {
  @ViewChild(DtOrder, { static: true }) _dtOrder: DtOrder<any>;

  dataObservable = new BehaviorSubject<object[]>([]);
  dataSource = new DtTableOrderDataSource<any>(this.dataObservable.value);
  cancelSubscriptionSource = new Subject<void>();

  // eslint-disable-next-line no-magic-numbers
  private source = interval(1000);
  subscription: Subscription;
  isSubscribed = false;

  ngOnInit(): void {
    this.dataSource.order = this._dtOrder;
  }

  startSubscription(): void {
    this.isSubscribed = true;
    this.subscription = this.source
      .pipe(
        take(MAX_ROWS),
        takeUntil(this.cancelSubscriptionSource),
        finalize(() => {
          this.isSubscribed = false;
        }),
      )
      .subscribe((): void => {
        this.getAnotherRow();
      });
  }

  cancelSubscription(): void {
    this.cancelSubscriptionSource.next();
  }

  clearRows(): void {
    this.dataObservable.next([]);
    this.dataSource.data = [];
  }

  getAnotherRow(): void {
    /* eslint-disable */
    this.dataObservable.next([
      ...this.dataObservable.value,
      {
        host: 'et-demo-2-win4',
        cpu: `${(Math.random() * 10).toFixed(2)} %`,
        memory: `${(Math.random() * 10).toFixed(2)} % of ${(
          Math.random() * 40
        ).toFixed(2)} GB`,
        traffic: `${(Math.random() * 100).toFixed(2)} Mbit/s`,
      },
    ]);
    /* eslint-enable */
    this.dataSource.data = this.dataObservable.value;
  }
}
