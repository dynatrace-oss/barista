import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  // tslint:disable
  template: `
  <dt-table [dataSource]="dataSource1">
    <ng-container dtColumnDef="host" dtColumnType="text">
      <dt-header-cell *dtHeaderCellDef>Host</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{row.host}}</dt-cell>
    </ng-container>

    <ng-container dtColumnDef="cpu" dtColumnType="text">
      <dt-header-cell *dtHeaderCellDef>CPU</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{row.cpu}}</dt-cell>
    </ng-container>

    <ng-container dtColumnDef="memory" dtColumnType="number">
      <dt-header-cell *dtHeaderCellDef>Memory</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{row.memory}}</dt-cell>
    </ng-container>

    <ng-container dtColumnDef="traffic" dtColumnType="control">
      <dt-header-cell *dtHeaderCellDef>Network traffic</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{row.traffic}}</dt-cell>
    </ng-container>

    <dt-table-empty-state>
      <dt-table-empty-state-image>
        <img src="https://image.flaticon.com/icons/svg/34/34202.svg">
      </dt-table-empty-state-image>
      <dt-table-empty-state-title>No host</dt-table-empty-state-title>
      <dt-table-empty-state-message>{{ message }}</dt-table-empty-state-message>
    </dt-table-empty-state>

    <dt-header-row *dtHeaderRowDef="['host', 'cpu', 'memory', 'traffic']"></dt-header-row>
    <dt-row *dtRowDef="let row; columns: ['host', 'cpu', 'memory', 'traffic'];"></dt-row>
  </dt-table>
  <button (click)="toggleEmptyState()">Toggle empty state</button>`,
  // tslint:enable
})
export class TableEmptyStateComponent {
  dataSource: object[] = [
    { host: 'et-demo-2-win4', cpu: '30 %', memory: '38 % of 5.83 GB', traffic: '98.7 Mbit/s' },
    { host: 'et-demo-2-win3', cpu: '26 %', memory: '46 % of 6 GB', traffic: '625 Mbit/s' },
    { host: 'docker-host2', cpu: '25.4 %', memory: '38 % of 5.83 GB', traffic: '419 Mbit/s' },
    { host: 'et-demo-2-win1', cpu: '23 %', memory: '7.86 % of 5.83 GB', traffic: '98.7 Mbit/s' },
  ];
  dataSource1: object[] = [];
  message = `from 9:00 - 10:00
  Remove filters to make your search less restrictive
  Expand or change the timeframe you're searching within.
  `;

  toggleEmptyState(): void {
    this.dataSource1 = this.dataSource1.length ? [] : [...this.dataSource];
  }
}
