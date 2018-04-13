import { Component, ViewChild } from '@angular/core';
import { HeaderRowPlaceholder } from '@angular/cdk/table';
import { DtTable } from '@dynatrace/angular-components/table';

@Component({
  moduleId: module.id,
  selector: 'docs-table',
  templateUrl: './docs-table.component.html',
})
export class DocsTableComponent {
  private _dataSource: object[] = [
    { host: 'et-demo-2-win4', cpu: '30 %', memory: '38 % of 5.83 GB', traffic: '98.7 Mbit/s' },
    { host: 'et-demo-2-win3', cpu: '26 %', memory: '46 % of 6 GB', traffic: '625 Mbit/s' },
    { host: 'docker-host2', cpu: '25.4 %', memory: '38 % of 5.83 GB', traffic: '419 Mbit/s' },
    { host: 'et-demo-2-win1', cpu: '23 %', memory: '7.86 % of 5.83 GB', traffic: '98.7 Mbit/s' },
  ];
  dataSource: object[];

  @ViewChild(DtTable) table: DtTable<object[]>;

  constructor() {
    this.toggleDataSource();
  }

  toggleDataSource(param: boolean = false): void {
    this.dataSource = param ? [] : [...this._dataSource];
  }

  addRow(): void {
    this.dataSource.push({ host: 'host-test', cpu: 'cpu-test', memory: 'memory-test', traffic: 'traffic-test'});
    this._dataSource = [...this.dataSource];

    if (this.table) {
      this.table.renderRows();
    }
  }
}
