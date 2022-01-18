/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { DtContainerBreakpointObserver } from '@dynatrace/barista-components/container-breakpoint-observer';
import { DtTable } from '@dynatrace/barista-components/table';

interface HostMetricResponsive {
  host: string;
  cpu: string;
  memory: string;
  traffic: string;
  isNarrow: boolean;
}

@Component({
  selector: 'dt-example-table-responsive',
  templateUrl: './table-responsive-example.html',
})
export class DtExampleTableResponsive implements OnInit {
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

  _headerColumns = new Set();

  @ViewChild(DtContainerBreakpointObserver, { static: true })
  _tableBreakpointObserver: DtContainerBreakpointObserver;

  @ViewChild(DtTable, { static: true })
  _table: DtTable<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  private _tableNarrow = false;
  private _baseColumns = ['host', 'cpu'];

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this._tableBreakpointObserver
      .observe('(max-width: 1000px)')
      .subscribe((event) => {
        this._tableNarrow = event.matches;

        // Show/hide header columns respecting
        // whether the table is in the narrow state
        if (this._tableNarrow) {
          this._headerColumns = new Set(['details', ...this._baseColumns]);
        } else {
          this._headerColumns = new Set([
            ...this._baseColumns,
            'memory',
            'traffic',
          ]);
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
