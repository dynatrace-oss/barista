import { Component } from '@angular/core';
import { DtTableDataSource } from '@dynatrace/angular-components';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  styles: ['dt-table { margin: 2em 0; }'],
  // tslint:disable
  template: `
<dt-table [dataSource]="dataSource">
  <ng-container dtColumnDef="host" dtColumnAlign="text">
    <dt-header-cell *dtHeaderCellDef>Host</dt-header-cell>
    <dt-cell *dtCellDef="let row">
      <dt-highlight [term]="value">{{row.host}}</dt-highlight>
    </dt-cell>
  </ng-container>

  <ng-container dtColumnDef="cpu" dtColumnAlign="text">
    <dt-header-cell *dtHeaderCellDef>CPU</dt-header-cell>
    <dt-cell *dtCellDef="let row;">{{row.cpu}}</dt-cell>
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
  <dt-row *dtRowDef="let row; columns: ['host', 'cpu', 'memory', 'traffic']"></dt-row>
</dt-table>

<input dtInput [dtAutocomplete]="auto" [(ngModel)]="value" (ngModelChange)="filter()" placeholder="Start typing">
<dt-autocomplete #auto="dtAutocomplete">
  <dt-option *ngFor="let option of filterableValues" [value]="option">{{option}}</dt-option>
</dt-autocomplete>

`,
  // tslint:enable
})
export class TableFilteringExample {
  private data: Array<{host: string; cpu: number; memoryPerc: number; memoryTotal: number; traffic: number}> = [
    { host: 'et-demo-2-win4', cpu: 30, memoryPerc: 38, memoryTotal: 5830000000, traffic: 98700000 },
    { host: 'et-demo-2-win3', cpu: 26, memoryPerc: 46, memoryTotal: 6000000000, traffic: 62500000 },
    { host: 'docker-host2', cpu: 25.4, memoryPerc: 35, memoryTotal: 5810000000, traffic: 41900000 },
    { host: 'et-demo-2-win1', cpu: 23, memoryPerc: 7.86, memoryTotal: 5820000000, traffic: 98700000 },
    { host: 'et-demo-2-win8', cpu: 78, memoryPerc: 21, memoryTotal: 3520000000, traffic: 91870000 },
    { host: 'et-demo-2-macOS', cpu: 21, memoryPerc: 34, memoryTotal: 3200000000, traffic: 1200000 },
    { host: 'kyber-host6', cpu: 12.3, memoryPerc: 12, memoryTotal: 2120000000, traffic: 4500000 },
  ];

  value: string;
  dataSource: DtTableDataSource<object>;

  get filterableValues(): string[] {
    return this.data.map((data: {host: string; cpu: number; memoryPerc: number; memoryTotal: number; traffic: number}) =>
      data.host);
  }

  constructor() {
    this.dataSource = new DtTableDataSource(this.data);
  }

  filter(): void {
    this.dataSource.filter = this.value;
  }

}
