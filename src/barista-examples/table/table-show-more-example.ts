import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import {
  DtTableDataSource,
  formatPercent,
  formatBytes,
  formatRate,
  DtShowMore,
} from '@dynatrace/angular-components';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  // tslint:disable
  template: `
    <dt-table [dataSource]="dataSource">
      <dt-simple-text-column
        name="host"
        label="Host"
        sortable="false"
      ></dt-simple-text-column>
      <dt-simple-number-column
        name="cpu"
        label="CPU"
        sortable="false"
        [formatter]="percentageFormatter"
      ></dt-simple-number-column>
      <dt-simple-number-column
        name="memory"
        label="Memory"
        sortable="false"
        [formatter]="percentageFormatter"
      ></dt-simple-number-column>
      <dt-simple-number-column
        name="traffic"
        label="Traffic"
        sortable="false"
        [formatter]="trafficFormatter"
      ></dt-simple-number-column>

      <dt-header-row
        *dtHeaderRowDef="['host', 'cpu', 'memory', 'traffic']"
      ></dt-header-row>
      <dt-row
        *dtRowDef="let row; columns: ['host', 'cpu', 'memory', 'traffic']"
      ></dt-row>
    </dt-table>

    <dt-show-more (click)="loadMore()">
      Show 5 more
    </dt-show-more>
  `,
  // tslint:enable
})
export class TableShowMoreExample implements OnInit, OnDestroy {
  percentageFormatter = formatPercent;
  dataSource: DtTableDataSource<{
    host: string;
    cpu: number;
    memory: number;
    traffic: number;
  }> = new DtTableDataSource();
  @ViewChild(DtShowMore, { static: true }) showMore: DtShowMore;
  private destroy$ = new Subject<void>();
  // tslint:disable-next-line:max-line-length
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
    this.fakeBackend
      .pipe(takeUntil(this.destroy$))
      .subscribe(
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
