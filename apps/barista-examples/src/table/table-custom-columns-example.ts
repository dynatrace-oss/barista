import { Component } from '@angular/core';

import {
  formatBytes,
  formatPercent,
} from '@dynatrace/angular-components/formatters';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  // tslint:disable
  template: `
    <dt-table [dataSource]="data">
      <ng-container dtColumnDef="host" dtColumnAlign="text">
        <dt-header-cell *dtHeaderCellDef>Host</dt-header-cell>
        <dt-cell *dtCellDef="let row">
          <dt-info-group>
            <dt-info-group-icon>
              <dt-icon name="host"></dt-icon>
            </dt-info-group-icon>
            <dt-info-group-title>{{ row.host }}</dt-info-group-title>
            Uptime: {{ row.uptime }}
          </dt-info-group>
        </dt-cell>
      </ng-container>

      <ng-container dtColumnDef="cpu" dtColumnAlign="number">
        <dt-header-cell *dtHeaderCellDef>CPU</dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.cpu | dtPercent }}</dt-cell>
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
export class TableCustomColumnsExample {
  data: object[] = [
    {
      host: 'et-demo-2-win4',
      uptime: '48 days',
      cpu: 30,
      memoryPerc: 38,
      memoryTotal: 5830000000,
      traffic: 75100000,
    },
    {
      host: 'et-demo-2-win3',
      uptime: '3 hours',
      cpu: 26,
      memoryPerc: 46,
      memoryTotal: 6000000000,
      traffic: 62500000,
    },
    {
      host: 'docker-host2',
      uptime: '113 days',
      cpu: 25.4,
      memoryPerc: 35,
      memoryTotal: 5810000000,
      traffic: 41900000,
    },
    {
      host: 'et-demo-2-win1',
      uptime: '5 days',
      cpu: 23,
      memoryPerc: 7.86,
      memoryTotal: 5820000000,
      traffic: 98700000,
    },
  ];

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
