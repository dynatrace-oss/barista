import { ViewportRuler } from '@angular/cdk/overlay';
import { Component, NgZone } from '@angular/core';
import { startWith, switchMap, take } from 'rxjs/operators';

import { DtViewportResizer } from '@dynatrace/angular-components/core';

const NARROW_THRESHHOLD = 1000;

interface HostMetricResponsive {
  host: string;
  cpu: string;
  memory: string;
  traffic: string;
  isNarrow: boolean;
}

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  // tslint:disable
  template: `
    <dt-table [dataSource]="dataSource">
      <ng-container dtColumnDef="host" dtColumnAlign="text">
        <dt-header-cell *dtHeaderCellDef>Host</dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.host }}</dt-cell>
      </ng-container>

      <ng-container dtColumnDef="cpu" dtColumnAlign="text">
        <dt-header-cell *dtHeaderCellDef>CPU</dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.cpu }}</dt-cell>
      </ng-container>

      <ng-container dtColumnDef="memory" dtColumnAlign="number">
        <dt-header-cell *dtHeaderCellDef>Memory</dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.memory }}</dt-cell>
      </ng-container>

      <ng-container dtColumnDef="traffic" dtColumnAlign="control">
        <dt-header-cell *dtHeaderCellDef>Network traffic</dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.traffic }}</dt-cell>
      </ng-container>

      <ng-container dtColumnDef="details" dtColumnAlign="number">
        <dt-header-cell *dtHeaderCellDef>Details</dt-header-cell>
        <dt-expandable-cell *dtCellDef></dt-expandable-cell>
      </ng-container>

      <dt-header-row *dtHeaderRowDef="_headerColumns"></dt-header-row>
      <dt-row
        *dtRowDef="
          let row;
          columns: ['host', 'cpu', 'memory', 'traffic'];
          let rowIndex = index;
          when: !isNarrow
        "
      ></dt-row>
      <dt-expandable-row
        *dtRowDef="
          let row;
          columns: ['host', 'cpu', 'details'];
          let rowIndex = index;
          when: isNarrow
        "
      >
        <dt-key-value-list>
          <dt-key-value-list-item>
            <dt-key-value-list-key>Memory</dt-key-value-list-key>
            <dt-key-value-list-value>{{ row.memory }}</dt-key-value-list-value>
          </dt-key-value-list-item>
          <dt-key-value-list-item>
            <dt-key-value-list-key>Traffic</dt-key-value-list-key>
            <dt-key-value-list-value>{{ row.traffic }}</dt-key-value-list-value>
          </dt-key-value-list-item>
        </dt-key-value-list>
      </dt-expandable-row>
    </dt-table>
  `,
  // tslint:enable
})
export class TableResponsiveExample {
  dataSource: HostMetricResponsive[] = [
    {
      host: 'et-demo-2-win4',
      cpu: '30 %',
      memory: '38 % of 5.83 GB',
      traffic: '98.7 Mbit/s',
      isNarrow: false,
    },
    {
      host: 'et-demo-2-win3',
      cpu: '26 %',
      memory: '46 % of 6 GB',
      traffic: '625 Mbit/s',
      isNarrow: false,
    },
    {
      host: 'docker-host2',
      cpu: '25.4 %',
      memory: '38 % of 5.83 GB',
      traffic: '419 Mbit/s',
      isNarrow: false,
    },
    {
      host: 'et-demo-2-win1',
      cpu: '23 %',
      memory: '7.86 % of 5.83 GB',
      traffic: '98.7 Mbit/s',
      isNarrow: false,
    },
  ];

  _headerColumns = new Set(['host', 'cpu']);

  isNarrow(_: number, row: HostMetricResponsive): boolean {
    return row.isNarrow;
  }

  constructor(
    private _viewportResizer: DtViewportResizer,
    private _viewportRuler: ViewportRuler,
    private _zone: NgZone,
  ) {
    this._viewportResizer
      .change()
      .pipe(
        startWith(null),
        switchMap(() => this._zone.onStable.pipe(take(1))),
      )
      .subscribe(() => {
        const narrow =
          this._viewportRuler.getViewportSize().width < NARROW_THRESHHOLD
            ? true
            : false;
        if (this.dataSource[0].isNarrow !== narrow) {
          this.dataSource = this.dataSource.map(data => {
            data.isNarrow = narrow;
            return data;
          });
        }
        if (narrow) {
          this._headerColumns.delete('memory');
          this._headerColumns.delete('traffic');
          this._headerColumns.add('details');
        } else {
          this._headerColumns.add('memory');
          this._headerColumns.add('traffic');
          this._headerColumns.delete('details');
        }
      });
  }
}
