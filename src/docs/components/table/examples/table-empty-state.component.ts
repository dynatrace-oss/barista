import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  // tslint:disable
  template: `
  <button (click)="toggleEmptyState()">Toggle empty state</button>

  <dt-table [dataSource]="dataSource1">
    <ng-container dtColumnDef="usersId" dtColumnAlign="text">
      <dt-header-cell *dtHeaderCellDef>Users ID</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{row.usersId}}</dt-cell>
    </ng-container>

    <ng-container dtColumnDef="sessionCount" dtColumnAlign="number">
      <dt-header-cell *dtHeaderCellDef>Session count</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{row.sessionCount}}</dt-cell>
    </ng-container>

    <ng-container dtColumnDef="averageDuration" dtColumnAlign="number">
      <dt-header-cell *dtHeaderCellDef>Average duration</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{row.averageDuration}}</dt-cell>
    </ng-container>

    <ng-container dtColumnDef="errors" dtColumnAlign="number">
      <dt-header-cell *dtHeaderCellDef>Errors</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{row.errors}}</dt-cell>
    </ng-container>

    <ng-container dtColumnDef="country" dtColumnAlign="text">
      <dt-header-cell *dtHeaderCellDef>Country</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{row.country}}</dt-cell>
    </ng-container>

    <ng-container dtColumnDef="city" dtColumnAlign="text">
      <dt-header-cell *dtHeaderCellDef>City</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{row.city}}</dt-cell>
    </ng-container>

    <ng-container dtColumnDef="browserFamily" dtColumnAlign="text">
      <dt-header-cell *dtHeaderCellDef>Browser Family</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{row.browserFamily}}</dt-cell>
    </ng-container>

    <ng-container dtColumnDef="device" dtColumnAlign="text">
      <dt-header-cell *dtHeaderCellDef>Device</dt-header-cell>
      <dt-cell *dtCellDef="let row">{{row.device}}</dt-cell>
    </ng-container>

    <dt-table-empty-state dtTableEmptyState>
      <dt-table-empty-state-image>
        <img alt="glass" src="data:image/png;base64,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">
      </dt-table-empty-state-image>

      <dt-table-empty-state-title>No data that matches your query</dt-table-empty-state-title>

      <dt-table-empty-state-message>{{ message }}</dt-table-empty-state-message>
    </dt-table-empty-state>

    <dt-header-row *dtHeaderRowDef="['usersId', 'sessionCount', 'averageDuration', 'errors', 'country', 'city', 'browserFamily', 'device']"></dt-header-row>
    <dt-row *dtRowDef="let row; columns: ['usersId', 'sessionCount', 'averageDuration', 'errors', 'country', 'city', 'browserFamily', 'device'];"></dt-row>
  </dt-table>`,
  // tslint:enable
})
@OriginalClassName('TableEmptyStateComponent')
export class TableEmptyStateComponent {
  dataSource: object[] = [
    {
      usersId: 'Alexander@sommers.at',
      sessionCount: 10,
      averageDuration: '13.6ms',
      errors: 6,
      country: 'Austria',
      city: 'Linz',
      browserFamily: 'Chrome',
      device: 'A1688',
    },
    {
      usersId: 'maximilian@mustermann.at',
      sessionCount: 8,
      averageDuration: '9.99ms',
      errors: 0,
      country: 'Austria',
      city: 'Salzburg',
      browserFamily: 'Firefox',
      device: 'A1688',
    },
    {
      usersId: 'karl@winter.at',
      sessionCount: 4,
      averageDuration: '9.55ms',
      errors: 1,
      country: 'Austria',
      city: 'Vienna',
      browserFamily: 'Firefox',
      device: 'A1688',
    },
  ];

  dataSource1: object[] = [];
  message = `Amend the timefrime you're querying within or
  review your query to make your statement less restrictive.`;

  toggleEmptyState(): void {
    this.dataSource1 = this.dataSource1.length ? [] : [...this.dataSource];
  }
}
