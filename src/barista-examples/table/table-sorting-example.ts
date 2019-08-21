import { Component } from '@angular/core';

import { DtSortEvent } from '@dynatrace/angular-components/table';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  styles: ['button { margin-top: 16px; }'],
  // tslint:disable
  template: `
    <dt-table
      [dataSource]="dataSource"
      dtSort
      (dtSortChange)="sortData($event)"
      [dtSortDisabled]="disableSorting"
      [dtSortActive]="'cpu'"
      dtSortStart="asc"
      dtSortDirection="desc"
    >
      <ng-container dtColumnDef="host" dtColumnAlign="text">
        <dt-header-cell
          *dtHeaderCellDef
          dt-sort-header
          sort-aria-label="Change sort order for hosts"
        >
          Host
        </dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.host }}</dt-cell>
      </ng-container>

      <ng-container dtColumnDef="cpu" dtColumnAlign="number">
        <dt-header-cell
          *dtHeaderCellDef
          dt-sort-header
          start="desc"
          sort-aria-label="Change sort order for CPUs"
        >
          CPU
        </dt-header-cell>
        <dt-cell *dtCellDef="let row">
          {{ row.cpu | dtPercent }}
        </dt-cell>
      </ng-container>

      <ng-container dtColumnDef="memory" dtColumnAlign="number">
        <dt-header-cell
          *dtHeaderCellDef
          dt-sort-header
          start="desc"
          sort-aria-label="Change sort order for memory"
        >
          Memory
        </dt-header-cell>
        <dt-cell *dtCellDef="let row">
          {{ row.memoryPerc | dtPercent }} of {{ row.memoryTotal | dtBytes }}
        </dt-cell>
      </ng-container>

      <ng-container dtColumnDef="traffic" dtColumnAlign="number">
        <dt-header-cell
          *dtHeaderCellDef
          disabled
          dt-sort-header
          sort-aria-label="Change sort order for network traffic"
        >
          Network traffic
        </dt-header-cell>
        <dt-cell *dtCellDef="let row">
          {{ row.traffic | dtBytes | dtRate: 's' }}
        </dt-cell>
      </ng-container>

      <dt-header-row
        *dtHeaderRowDef="['host', 'cpu', 'memory', 'traffic']"
      ></dt-header-row>
      <dt-row
        *dtRowDef="let row; columns: ['host', 'cpu', 'memory', 'traffic']"
      ></dt-row>
    </dt-table>
    <button
      dt-button
      variant="secondary"
      (click)="disableSorting = !disableSorting"
    >
      Toggle disable sorting for all columns
    </button>
  `,
  // tslint:enable
})
export class TableSortingExample {
  disableSorting = false;

  dataSource = [
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
  ];

  sortData(event: DtSortEvent): void {
    const data = this.dataSource.slice();

    this.dataSource = data.sort((a, b) => {
      const isAsc = event.direction === 'asc';
      switch (event.active) {
        case 'host':
          return this.compare(a.host, b.host, isAsc);
        case 'cpu':
          return this.compare(a.cpu, b.cpu, isAsc);
        case 'memory':
          return this.compare(a.memoryPerc, b.memoryPerc, isAsc);
        case 'traffic':
          return this.compare(a.traffic, b.traffic, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
