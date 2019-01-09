import { Component } from '@angular/core';

@Component({
  selector: 'table-demo',
  templateUrl: './table-demo.component.html',
  styleUrls: ['./table-demo.component.scss'],
})
export class TableDemo {
  dataSource: object[] = [
    { host: 'et-demo-2-win4', cpu: '30 %', memory: '38 % of 5.83 GB', traffic: '98.7 Mbit/s' },
    { host: 'et-demo-2-win3', cpu: '26 %', memory: '46 % of 6 GB', traffic: '625 Mbit/s' },
    { host: 'docker-host2', cpu: '25.4 %', memory: '38 % of 5.83 GB', traffic: '419 Mbit/s' },
    { host: 'et-demo-2-win1', cpu: '23 %', memory: '7.86 % of 5.83 GB', traffic: '98.7 Mbit/s' },
  ];

  rowClicked(row: object, index: number, count: number): void {
    console.log(row, index, count);
  }

  addRow(): void {
    this.dataSource = [...this.dataSource, { host: 'et-demo-2-win5', cpu: '23 %', memory: '7.86 % of 5.83 GB', traffic: '98.7 Mbit/s' },]
  }
}
