import { Component } from '@angular/core';
import { DtLogger, DtLoggerFactory } from '@dynatrace/angular-components';
import { OriginalClassName } from '../../../core/decorators';

const LOG: DtLogger = DtLoggerFactory.create('TableDefaultComponent');

@Component({
  moduleId: module.id,
  // tslint:disable
  styles: [
    '.example-container { overflow: auto; height: 300px; }'
  ],
  template: `
  <dt-table [dataSource]="dataSource1">
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
    <dt-cell *dtCellDef="let row"><dt-table-problem *ngIf="">{{row.memory}}</dt-table-problem></dt-cell>
  </ng-container>

  <ng-container dtColumnDef="traffic" dtColumnAlign="control">
    <dt-header-cell *dtHeaderCellDef>Network traffic</dt-header-cell>
    <dt-cell *dtCellDef="let row">{{row.traffic}}</dt-cell>
  </ng-container>

  <ng-container dtColumnDef="empty">
    <dt-cell *dtCellDef="let row" >This is empty</dt-cell>
  </ng-container>

  <dt-header-row *dtHeaderRowDef="['host', 'cpu', 'memory', 'traffic']"></dt-header-row>
  <dt-row *dtRowDef="let row; columns: ['host', 'cpu', 'memory', 'traffic']; index as i; count as c; first as f; last as l; even as e; odd as o; when: !isEmpty" (click)="rowClicked(row, i, c)"></dt-row>
  <dt-row *dtRowDef="let row; columns: ['empty']; when: isEmpty"></dt-row>
</dt-table>`,
  // tslint:enable
})
@OriginalClassName('TableDefaultComponent')
export class TableDefaultComponent {
  dataSource1: Array<{ host: string; cpu: string; memory: string; traffic: string; empty: boolean }> = [
    { host: 'et-demo-2-win4', cpu: '30 %', memoryPerc: 38, memoryTotal: 6259914833, traffic: '98.7 Mbit/s', empty: false },
    { host: 'et-demo-2-win3', cpu: '26 %', memory: '46 % of 6 GB', traffic: '625 Mbit/s',  empty: true },
    { host: 'docker-host2', cpu: '25.4 %', memory: '38 % of 5.83 GB', traffic: '419 Mbit/s', empty: false },
    { host: 'et-demo-2-win1', cpu: '23 %', memory: '7.86 % of 5.83 GB', traffic: '98.7 Mbit/s', empty: false },
  ];

  isEmpty = (index: number, data: { host: string; cpu: string; memory: string; traffic: string; empty: boolean}) => data.empty;
}
