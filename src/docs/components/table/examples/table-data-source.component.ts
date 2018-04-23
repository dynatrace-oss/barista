import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DtDataSource } from '@dynatrace/angular-components/table';

@Component({
  moduleId: module.id,
  // tslint:disable
  template: `
  <button (click)="getAnotherRow()">Add one more Row</button>
  <button (click)="clearRows()">Clear</button>
  <dt-table >
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

    <dt-header-row *dtHeaderRowDef="['host', 'cpu', 'memory', 'traffic']"></dt-header-row>
    <dt-row *dtRowDef="let row; columns: ['host', 'cpu', 'memory', 'traffic'];"></dt-row>
  </dt-table>`
  // tslint:enable
})
export class TableDataSourceComponent {
  // localDataSource = new DtDataSource<object[]>();

  constructor() {
    this.getAnotherRow();
    this.getAnotherRow();
    this.getAnotherRow();

    this.clearRows();
  }

  clearRows(): void {
    // this.localDataSource.data = [];
  }

  getAnotherRow(): void {
    // const { data } = this.localDataSource;
    // tslint:disable
    // this.localDataSource.data = (
    // [...data, {
    //   host: 'et-demo-2-win4',
    //   cpu: `${(Math.random() * 10).toFixed(2)} %`,
    //   memory: `${(Math.random() * 10).toFixed(2)} % of ${(Math.random() * 40).toFixed(2)} GB`,
    //   traffic: `${(Math.random() * 100).toFixed(2)} Mbit/s`,
    // }]);
    // tslint:enable
  }
}
