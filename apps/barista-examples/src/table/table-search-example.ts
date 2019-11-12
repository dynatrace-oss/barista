import { Component, OnInit, ViewChild } from '@angular/core';

import {
  formatBytes,
  formatPercent,
} from '@dynatrace/angular-components/formatters';
import {
  DtTableDataSource,
  DtTableSearch,
} from '@dynatrace/angular-components/table';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  styles: ['dt-table { margin-bottom: 24px; }'],
  // tslint:disable
  template: `
    <dt-table-search
      name="tableSearch"
      [(ngModel)]="searchValue"
      placeholder="Search table data..."
      aria-label="Search table data"
    ></dt-table-search>

    <dt-table [dataSource]="dataSource">
      <ng-container dtColumnDef="host" dtColumnAlign="text">
        <dt-header-cell *dtHeaderCellDef>Host</dt-header-cell>
        <dt-cell *dtCellDef="let row">
          <dt-highlight [term]="searchValue">{{ row.host }}</dt-highlight>
        </dt-cell>
      </ng-container>

      <ng-container dtColumnDef="cpu" dtColumnAlign="text">
        <dt-header-cell *dtHeaderCellDef>CPU</dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.cpu }}</dt-cell>
      </ng-container>

      <ng-container dtColumnDef="memory" dtColumnAlign="number">
        <dt-header-cell *dtHeaderCellDef>Memory</dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ combineMemory(row) }}</dt-cell>
      </ng-container>

      <ng-container dtColumnDef="traffic" dtColumnAlign="number">
        <dt-header-cell *dtHeaderCellDef>Network traffic</dt-header-cell>
        <dt-cell *dtCellDef="let row">
          {{ row.traffic | dtMegabytes: 1024 | dtRate: 's' }}
        </dt-cell>
      </ng-container>

      <dt-header-row
        *dtHeaderRowDef="['host', 'cpu', 'memory', 'traffic']"
      ></dt-header-row>
      <dt-row
        *dtRowDef="let row; columns: ['host', 'cpu', 'memory', 'traffic']"
      ></dt-row>
    </dt-table>
  `,
  // tslint:enable
})
export class TableSearchExample implements OnInit {
  data: object[] = [
    {
      host: 'et-demo-2-win4',
      cpu: 30,
      memoryPerc: 38,
      memoryTotal: 5830000000,
      traffic: 98700000,
    },
    {
      host: 'et-demo-2-win3',
      cpu: 26,
      memoryPerc: 46,
      memoryTotal: 6000000000,
      traffic: 62500000,
    },
    {
      host: 'docker-host2',
      cpu: 25.4,
      memoryPerc: 35,
      memoryTotal: 5810000000,
      traffic: 41900000,
    },
    {
      host: 'et-demo-2-win1',
      cpu: 23,
      memoryPerc: 7.86,
      memoryTotal: 5820000000,
      traffic: 98700000,
    },
    {
      host: 'et-demo-2-win8',
      cpu: 78,
      memoryPerc: 21,
      memoryTotal: 3520000000,
      traffic: 91870000,
    },
    {
      host: 'et-demo-2-macOS',
      cpu: 21,
      memoryPerc: 34,
      memoryTotal: 3200000000,
      traffic: 1200000,
    },
    {
      host: 'kyber-host6',
      cpu: 12.3,
      memoryPerc: 12,
      memoryTotal: 2120000000,
      traffic: 4500000,
    },
  ];

  @ViewChild(DtTableSearch, { static: true })
  tableSearch: DtTableSearch;

  searchValue = '';
  dataSource: DtTableDataSource<object>;

  constructor() {
    this.dataSource = new DtTableDataSource(this.data);
  }

  ngOnInit(): void {
    this.dataSource.search = this.tableSearch;
  }

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
}
