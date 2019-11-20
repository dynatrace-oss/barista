/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

import { Component } from '@angular/core';

@Component({
  selector: 'component-barista-example',
  // tslint:disable
  template: `
    <dt-table [dataSource]="dataSource">
      <ng-container
        *ngFor="let column of columnsDef"
        [dtColumnDef]="column.id"
        [dtColumnAlign]="column.type"
      >
        <dt-header-cell *dtHeaderCellDef>{{ column.title }}</dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row[column.id] }}</dt-cell>
      </ng-container>

      <dt-header-row *dtHeaderRowDef="columnsName"></dt-header-row>
      <dt-row *dtRowDef="let row; columns: columnsName"></dt-row>
    </dt-table>
  `,
  // tslint:enable
})
export class TableDynamicColumnsExample {
  columnsDef = [
    {
      id: 'host',
      title: 'Host',
      type: 'text',
    },
    {
      id: 'cpu',
      title: 'CPU',
      type: 'number',
    },
    {
      id: 'memory',
      title: 'Memory',
      type: 'number',
    },
    {
      id: 'traffic',
      title: 'Traffic',
      type: 'number',
    },
  ];
  columnsName = this.columnsDef.map(col => col.id);

  dataSource: object[] = [
    {
      host: 'et-demo-2-win4',
      cpu: '30 %',
      memory: '38 % of 5.83 GB',
      traffic: '98.7 Mbit/s',
    },
    {
      host: 'et-demo-2-win3',
      cpu: '26 %',
      memory: '46 % of 6 GB',
      traffic: '625 Mbit/s',
    },
    {
      host: 'docker-host2',
      cpu: '25.4 %',
      memory: '38 % of 5.83 GB',
      traffic: '419 Mbit/s',
    },
    {
      host: 'et-demo-2-win1',
      cpu: '23 %',
      memory: '7.86 % of 5.83 GB',
      traffic: '98.7 Mbit/s',
    },
  ];
}
