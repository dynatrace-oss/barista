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

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  formatBytes,
  formatPercent,
  formatRate,
} from '@dynatrace/barista-components/formatters';
import { DtShowMore } from '@dynatrace/barista-components/show-more';
import { DtTableDataSource } from '@dynatrace/barista-components/table';

@Component({
  selector: 'dt-example-table-show-more',
  templateUrl: './table-show-more-example.html',
})
export class DtExampleTableShowMore implements OnInit, OnDestroy {
  percentageFormatter = formatPercent;
  dataSource: DtTableDataSource<{
    host: string;
    cpu: number;
    memory: number;
    traffic: number;
  }> = new DtTableDataSource();
  @ViewChild(DtShowMore, { static: true }) showMore: DtShowMore;
  private destroy$ = new Subject<void>();
  // eslint-disable-next-line max-len
  private fakeBackend = new BehaviorSubject<
    Array<{
      host: string;
      cpu: number;
      memory: number;
      memoryTotal: number;
      traffic: number;
    }>
  >([
    {
      host: 'et-demo-2-win4',
      cpu: 30,
      memory: 38,
      memoryTotal: 5830000000,
      traffic: 98700000,
    },
    {
      host: 'et-demo-2-win3',
      cpu: 26,
      memory: 46,
      memoryTotal: 6000000000,
      traffic: 62500000,
    },
    {
      host: 'docker-host2',
      cpu: 25.4,
      memory: 35,
      memoryTotal: 5810000000,
      traffic: 41900000,
    },
  ]);

  ngOnInit(): void {
    this.fakeBackend.pipe(takeUntil(this.destroy$)).subscribe(
      (
        data: Array<{
          host: string;
          cpu: number;
          memory: number;
          traffic: number;
        }>,
      ) => {
        this.dataSource.data = data;
      },
    );
  }

  loadMore(): void {
    this.fakeBackend.next([
      {
        host: 'et-demo-2-win4',
        cpu: 30,
        memory: 38,
        memoryTotal: 5830000000,
        traffic: 98700000,
      },
      {
        host: 'et-demo-2-win3',
        cpu: 26,
        memory: 46,
        memoryTotal: 6000000000,
        traffic: 62500000,
      },
      {
        host: 'docker-host2',
        cpu: 25.4,
        memory: 35,
        memoryTotal: 5810000000,
        traffic: 41900000,
      },
      {
        host: 'et-demo-2-win1',
        cpu: 23,
        memory: 7.86,
        memoryTotal: 5820000000,
        traffic: 98700000,
      },
      {
        host: 'et-demo-2-win8',
        cpu: 78,
        memory: 21,
        memoryTotal: 3520000000,
        traffic: 91870000,
      },
      {
        host: 'et-demo-2-macOS',
        cpu: 21,
        memory: 34,
        memoryTotal: 3200000000,
        traffic: 1200000,
      },
      {
        host: 'kyber-host6',
        cpu: 12.3,
        memory: 12,
        memoryTotal: 2120000000,
        traffic: 4500000,
      },
      {
        host: 'dev-demo-5-macOS',
        cpu: 24,
        memory: 8.6,
        memoryTotal: 4670000000,
        traffic: 3270000,
      },
    ]);

    this.showMore.disabled = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trafficFormatter = (value: number) =>
    formatBytes(formatRate(value, 's'), {
      inputUnit: 'byte',
      outputUnit: 'MB',
      factor: 1024,
    });
}
