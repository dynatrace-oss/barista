import { Component } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

const MAX_ROWS = 5;

@Component({
  moduleId: module.id,
  // tslint:disable
  template: `
  <button (click)="startSubscription()">Start subscription</button>
  <button (click)="clearRows()">Clear</button>
  <dt-table [dataSource]="dataSource1">
    <ng-container dtColumnDef="host" dtColumnAlign="text">
      <dt-header-cell *dtHeaderCellDef>Host</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{row.host}}</dt-cell>
    </ng-container>

    <ng-container dtColumnDef="cpu" dtColumnAlign="text">
      <dt-header-cell *dtHeaderCellDef>CPU</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{row.cpu}}</dt-cell>
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
    <dt-row *dtRowDef="let row; columns: ['host', 'cpu', 'memory', 'traffic'];"></dt-row>
  </dt-table>`
  // tslint:enable
})
export class TableObservableComponent {
  dataSource1 = new BehaviorSubject<object[]>([]);

  emptyTitle = 'No Host';
  emptyMessage = `from 9:00 - 10:00\n Remove filter to make your search less restrictive.
  Expand or change the timeframe you're searching within.`;
  // tslint:disable-next-line:no-magic-numbers
  private source = interval(1000);
  subscription: Subscription;

  startSubscription(): void {
    this.subscription = this.source
    .pipe(take(MAX_ROWS))
    .subscribe((): void => {
      this.getAnotherRow();
    });
  }

  clearRows(): void {
    this.dataSource1.next([]);
  }

  getAnotherRow(): void {
    // tslint:disable
    this.dataSource1.next(
    [...this.dataSource1.value, {
      host: 'et-demo-2-win4',
      cpu: `${(Math.random() * 10).toFixed(2)} %`,
      memory: `${(Math.random() * 10).toFixed(2)} % of ${(Math.random() * 40).toFixed(2)} GB`,
      traffic: `${(Math.random() * 100).toFixed(2)} Mbit/s`,
    }]);
    // tslint:enable
  }
}
