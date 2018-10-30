import { Component } from '@angular/core';
import { DtLogger, DtLoggerFactory } from '@dynatrace/angular-components';
import { OriginalClassName } from '../../../core/decorators';
import { DtSort } from '@dynatrace/angular-components/table';

const LOG: DtLogger = DtLoggerFactory.create('TableSortingComponent');

@Component({
  moduleId: module.id,
  // tslint:disable
  template: `<dt-table [dataSource]="dataSource" dtSort (dtSortChange)="sortData($event)">
  <ng-container dtColumnDef="host" dtColumnAlign="text">
    <dt-header-cell *dtHeaderCellDef dt-sort-header dt-sort-header-aria-label="Change sort order for hosts">Host</dt-header-cell>
    <dt-cell *dtCellDef="let row">{{row.host}}</dt-cell>
  </ng-container>

  <ng-container dtColumnDef="cpu" dtColumnAlign="text">
    <dt-header-cell *dtHeaderCellDef>CPU</dt-header-cell>
    <dt-cell *dtCellDef="let row; index as i; count as c; first as f; last as l; even as e; odd as o">{{row.cpu | dtPercent}}</dt-cell>
  </ng-container>

  <ng-container dtColumnDef="memory" dtColumnAlign="number">
    <dt-header-cell *dtHeaderCellDef dt-sort-header start="desc">Memory</dt-header-cell>
    <dt-cell *dtCellDef="let row">{{row.memoryPerc | dtPercent}} of {{row.memoryTotal | dtBytes }}</dt-cell>
  </ng-container>

  <ng-container dtColumnDef="traffic" dtColumnAlign="control">
    <dt-header-cell *dtHeaderCellDef dt-sort-header disabled>Network traffic</dt-header-cell>
    <dt-cell *dtCellDef="let row">{{row.traffic | dtBytes | dtRate: 's' }}</dt-cell>
  </ng-container>

  <dt-header-row *dtHeaderRowDef="['host', 'cpu', 'memory', 'traffic']"></dt-header-row>
  <dt-row *dtRowDef="let row; columns: ['host', 'cpu', 'memory', 'traffic']; index as i; count as c; first as f; last as l; even as e; odd as o"></dt-row>
</dt-table>`,
  // tslint:enable
})
@OriginalClassName('TableSortingComponent')
export class TableSortingComponent {
  dataSource: Array<{ host: string; cpu: number; memoryPerc: number; memoryTotal: number; traffic: number }> = [
    { host: 'et-demo-2-win3', cpu: 26, memoryPerc: 46, memoryTotal: 6000000000, traffic: 62500000 },
    { host: 'et-demo-2-win4', cpu: 30, memoryPerc: 38, memoryTotal: 5830000000, traffic: 98700000 },
    { host: 'docker-host2', cpu: 25.4, memoryPerc: 35, memoryTotal: 5810000000, traffic: 41900000 },
    { host: 'et-demo-2-win1', cpu: 23, memoryPerc: 7.86, memoryTotal: 5820000000, traffic: 98700000 },
  ];

  sortData(event: DtSort): void {
    const data = this.dataSource.slice();
    if (!event.active || event.direction === '') {
      this.dataSource = data;
      return;
    }

    this.dataSource = data.sort((a, b) => {
      const isAsc = event.direction === 'asc';
      switch (event.active) {
        case 'host': return this.compare(a.host, b.host, isAsc);
        case 'cpu': return this.compare(a.cpu, b.cpu, isAsc);
        case 'memory': return this.compare(a.memoryPerc, b.memoryPerc, isAsc);
        case 'traffic': return this.compare(a.traffic, b.traffic, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
