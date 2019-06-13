import { Component } from '@angular/core';
import { DtLogger, DtLoggerFactory } from '@dynatrace/angular-components';

const LOG: DtLogger = DtLoggerFactory.create('TableDefaultComponent');

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  // tslint:disable
  template: `<dt-table [dataSource]="dataSource1">
  <ng-container dtColumnDef="host" dtColumnAlign="text">
    <dt-header-cell *dtHeaderCellDef>Host</dt-header-cell>
    <dt-cell *dtCellDef="let row">{{row.host}}</dt-cell>
  </ng-container>

  <ng-container dtColumnDef="cpu" dtColumnAlign="text">
    <dt-header-cell *dtHeaderCellDef>CPU</dt-header-cell>
    <dt-cell *dtCellDef="let row; index as i; count as c; first as f; last as l; even as e; odd as o">Row {{i}}/{{c}} {{e ? 'even' : 'odd'}}: {{row.cpu}} {{f ? 'first': ''}} {{l ? 'last' : ''}}</dt-cell>
  </ng-container>

  <ng-container dtColumnDef="memory" dtColumnAlign="number">
    <dt-header-cell *dtHeaderCellDef>Memory</dt-header-cell>
    <dt-cell *dtCellDef="let row">{{row.memory}}</dt-cell>
  </ng-container>

  <ng-container dtColumnDef="traffic" dtColumnAlign="control">
    <dt-header-cell *dtHeaderCellDef>Network traffic</dt-header-cell>
    <dt-cell *dtCellDef="let row">{{row.traffic}}</dt-cell>
  </ng-container>

  <dt-header-row *dtHeaderRowDef="['host', 'cpu', 'memory', 'traffic']"></dt-header-row>
  <dt-row *dtRowDef="let row; columns: ['host', 'cpu', 'memory', 'traffic']; index as i; count as c; first as f; last as l; even as e; odd as o" (click)="rowClicked(row, i, c)"></dt-row>
</dt-table>`,
  // tslint:enable
})
export class TableDefaultComponent {
  dataSource1: object[] = [
    { host: 'et-demo-2-win4', cpu: '30 %', memory: '38 % of 5.83 GB', traffic: '98.7 Mbit/s' },
    { host: 'et-demo-2-win3', cpu: '26 %', memory: '46 % of 6 GB', traffic: '625 Mbit/s' },
    { host: 'docker-host2', cpu: '25.4 %', memory: '38 % of 5.83 GB', traffic: '419 Mbit/s' },
    { host: 'et-demo-2-win1', cpu: '23 %', memory: '7.86 % of 5.83 GB', traffic: '98.7 Mbit/s' },
  ];

  rowClicked(row: object, index: number, count: number): void {
    // tslint:disable-next-line
    LOG.debug(`row ${index}/${count} clicked`, row);
  }
}
