import { AfterViewInit, Component, ViewChild } from '@angular/core';

import {
  formatBytes,
  formatPercent,
  formatRate,
} from '@dynatrace/angular-components/formatters';
import { DtSort, DtTableDataSource } from '@dynatrace/angular-components/table';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <dt-table [dataSource]="dataSource" dtSort #sortable>
      <ng-container dtColumnDef="webRequestName" dtColumnAlign="text">
        <dt-header-cell *dtHeaderCellDef>Web request name</dt-header-cell>
        <dt-cell *dtCellDef="let row">
          <a class="dt-link">{{ row.webRequestName }}</a>
        </dt-cell>
      </ng-container>
      <a class="dt-link">Sample link</a>
      <ng-container dtColumnDef="totalTimeConsumption" dtColumnAlign="text">
        <dt-header-cell *dtHeaderCellDef>Total consumption time</dt-header-cell>
        <dt-cell *dtCellDef="let row">
          <dt-bar-indicator
            [value]="row.totalTimeConsumption"
            align="end"
          ></dt-bar-indicator>
        </dt-cell>
      </ng-container>
      <dt-simple-text-column
        name="avgResponseTime"
        label="Avg response time"
      ></dt-simple-text-column>
      <dt-header-row
        *dtHeaderRowDef="[
          'webRequestName',
          'totalTimeConsumption',
          'avgResponseTime'
        ]"
      ></dt-header-row>
      <dt-row
        *dtRowDef="
          let row;
          columns: ['webRequestName', 'totalTimeConsumption', 'avgResponseTime']
        "
      ></dt-row>
    </dt-table>
  `,
  styles: [
    `
      :host ::ng-deep dt-bar-indicator {
        width: 100%;
      }
    `,
  ],
})
export class BarIndicatorTableExample implements AfterViewInit {
  data: object[] = [
    {
      webRequestName: '/services/AuthenticationService/',
      totalTimeConsumption: 100,
      avgResponseTime: '1.24 ms',
    },
    {
      webRequestName: 'contact-orange.jsf',
      totalTimeConsumption: 10,
      avgResponseTime: '3.34 ms',
    },
    {
      webRequestName: 'orange-booking-finish.jsf',
      totalTimeConsumption: 4,
      avgResponseTime: '3.55 ms',
    },
    {
      webRequestName: 'service/JourneyService/findlocations',
      totalTimeConsumption: 1,
      avgResponseTime: '2.58 ms',
    },
  ];

  // Get the viewChild to pass the sorter reference to the datasource.
  @ViewChild('sortable', { read: DtSort, static: true }) sortable: DtSort;
  // Initialize the table's data source
  dataSource: DtTableDataSource<object>;
  constructor() {
    this.dataSource = new DtTableDataSource(this.data);
  }
  ngAfterViewInit(): void {
    // Set the dtSort reference on the dataSource, so it can react to sorting.
    this.dataSource.sort = this.sortable;
  }
  percentageFormatter = formatPercent;
  trafficFormatter = (value: number) =>
    formatBytes(formatRate(value, 's'), {
      inputUnit: 'byte',
      outputUnit: 'MB',
      factor: 1024,
    });
  // tslint:disable-next-line: no-any
  combineMemory(row: any): string {
    const memoryPercentage = formatPercent(row.memoryPerc);
    const memoryTotal = formatBytes(row.memoryTotal, {
      inputUnit: 'byte',
      outputUnit: 'GB',
      factor: 1024,
    });
    return `${memoryPercentage} of ${memoryTotal}`;
  }
  // tslint:disable-next-line: no-any
  memorySortAccessor(row: any): number {
    return row.memoryPerc;
  }
}
