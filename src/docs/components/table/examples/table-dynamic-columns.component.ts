import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  // tslint:disable
  template: `
  <dt-table [dataSource]="dataSource1" [isLoading]="tableLoading">

    <ng-container *ngFor="let column of columnsDef;" [dtColumnDef]="column.id" [dtColumnAlign]="column.type">
      <dt-header-cell *dtHeaderCellDef>{{ column.title }}</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{ row[column.id] }}</dt-cell>
    </ng-container>

    <dt-header-row *dtHeaderRowDef="columnsName"></dt-header-row>
    <dt-row *dtRowDef="let row; columns: columnsName;"></dt-row>
  </dt-table>`
  // tslint:enable
})
@OriginalClassName('TableDynamicColumnsComponent')
export class TableDynamicColumnsComponent {
  columnsDef = [
    {
      id: 'host',
      title: 'Host',
      type: 'text',
    },
    {
      id: 'cpu',
      title: 'Cpu',
      type: 'text',
    },
    {
      id: 'memory',
      title: 'Memory',
      type: 'number',
    },
    {
      id: 'traffic',
      title: 'Traffic',
      type: 'control',
    },
  ];
  columnsName = this.columnsDef.map((col) => (col.id));

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
