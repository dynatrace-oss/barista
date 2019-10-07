import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { DtContainerBreakpointObserver } from '@dynatrace/angular-components/container-breakpoint-observer';
import { DtTable } from '@dynatrace/angular-components/table';

interface HostMetricResponsive {
  host: string;
  cpu: string;
  memory: string;
  traffic: string;
  isNarrow: boolean;
}

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  // tslint:disable
  template: `
    <dt-container-breakpoint-observer>
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
            when: !_isTableNarrow
          "
        ></dt-row>
        <dt-expandable-row
          *dtRowDef="
            let row;
            columns: ['host', 'cpu', 'details'];
            let rowIndex = index;
            when: _isTableNarrow
          "
        >
          <ng-template dtExpandableRowContent>
            <dt-key-value-list>
              <dt-key-value-list-item>
                <dt-key-value-list-key>Memory</dt-key-value-list-key>
                <dt-key-value-list-value>{{
                  row.memory
                }}</dt-key-value-list-value>
              </dt-key-value-list-item>
              <dt-key-value-list-item>
                <dt-key-value-list-key>Traffic</dt-key-value-list-key>
                <dt-key-value-list-value>{{
                  row.traffic
                }}</dt-key-value-list-value>
              </dt-key-value-list-item>
            </dt-key-value-list>
          </ng-template>
        </dt-expandable-row>
      </dt-table>
    </dt-container-breakpoint-observer>
  `,
  // tslint:enable
})
export class TableResponsiveExample implements OnInit {
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

  @ViewChild(DtContainerBreakpointObserver, { static: true })
  _tableBreakpointObserver: DtContainerBreakpointObserver;

  @ViewChild(DtTable, { static: true })
  _table: DtTable<any>; // tslint:disable-line: no-any

  private _tableNarrow = false;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this._tableBreakpointObserver
      .observe('(max-width: 1000px)')
      .subscribe(event => {
        this._tableNarrow = event.matches;

        // Show/hide header columns respecting
        // whether the table is in the narrow state
        if (this._tableNarrow) {
          this._headerColumns.delete('memory');
          this._headerColumns.delete('traffic');
          this._headerColumns.add('details');
        } else {
          this._headerColumns.add('memory');
          this._headerColumns.add('traffic');
          this._headerColumns.delete('details');
        }

        // Call render because we need to notify
        // the table that something has changes
        this._table.renderRows();

        this._changeDetectorRef.markForCheck();
      });
  }

  /**
   * Whether the table is in the narrow state.
   * This needs to be an arrow function because the table calls it with a wrong `this`.
   */
  _isTableNarrow = () => this._tableNarrow;
}
