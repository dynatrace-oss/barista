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
  styles: ['button { margin-top: 16px; }'],
  // tslint:disable
  template: `
    <dt-table [dataSource]="dataSource" [multiExpand]="multiExpand">
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
        <dt-expandable-cell
          *dtCellDef
          ariaLabel="Expand the row"
        ></dt-expandable-cell>
      </ng-container>

      <dt-header-row
        *dtHeaderRowDef="['host', 'cpu', 'memory', 'traffic', 'details']"
      ></dt-header-row>
      <dt-expandable-row
        *dtRowDef="
          let row;
          columns: ['host', 'cpu', 'memory', 'traffic', 'details']
        "
        [expanded]="row.expanded"
      >
        <ng-template dtExpandableRowContent>
          Expandable section for {{ row.host }}
        </ng-template>
      </dt-expandable-row>
    </dt-table>
    <button dt-button variant="secondary" (click)="multiExpand = !multiExpand">
      Toggle multiexpand (current value: {{ multiExpand }})
    </button>
  `,
  // tslint:enable
})
export class TableExpandableRowsExample {
  multiExpand = false;
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
      expanded: true,
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
