import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  // tslint:disable
  template: `
  <button (click)="toggleLoading()">Toggle loading property</button>
  <dt-table [dataSource]="dataSource1" [isLoading]="tableLoading">
    <ng-container dtColumnDef="host" dtColumnAlign="text">
      <th dtHeaderCell *dtHeaderCellDef>Host</th>
      <dt-cell *dtCellDef="let row">{{row.host}}</dt-cell>
    </ng-container>

    <ng-container dtColumnDef="cpu" dtColumnAlign="text">
      <th dtHeaderCell *dtHeaderCellDef>CPU</th>
      <dt-cell *dtCellDef="let row">{{row.cpu}}</dt-cell>
    </ng-container>

    <ng-container dtColumnDef="memory" dtColumnAlign="number">
      <th dtHeaderCell *dtHeaderCellDef>Memory</th>
      <dt-cell *dtCellDef="let row">{{row.memory}}</dt-cell>
    </ng-container>

    <ng-container dtColumnDef="traffic" dtColumnAlign="control">
      <th dtHeaderCell *dtHeaderCellDef>Network traffic</th>
      <dt-cell *dtCellDef="let row">{{row.traffic}}</dt-cell>
    </ng-container>

    <dt-loading-distractor dtTableLoadingState>Loading...</dt-loading-distractor>

    <dt-header-row *dtHeaderRowDef="['host', 'cpu', 'memory', 'traffic']"></dt-header-row>
    <dt-row *dtRowDef="let row; columns: ['host', 'cpu', 'memory', 'traffic'];"></dt-row>
  </dt-table>`
  // tslint:enable
})
@OriginalClassName('TableLoadingComponent')
export class TableLoadingComponent {
  dataSource1: object[] = [
    { host: 'et-demo-2-win4', cpu: '30 %', memory: '38 % of 5.83 GB', traffic: '98.7 Mbit/s' },
    { host: 'et-demo-2-win3', cpu: '26 %', memory: '46 % of 6 GB', traffic: '625 Mbit/s' },
    { host: 'docker-host2', cpu: '25.4 %', memory: '38 % of 5.83 GB', traffic: '419 Mbit/s' },
    { host: 'et-demo-2-win1', cpu: '23 %', memory: '7.86 % of 5.83 GB', traffic: '98.7 Mbit/s' },
  ];
  tableLoading = true;

  toggleLoading(): void {
    this.tableLoading = !this.tableLoading;
  }

}
