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
    <dt-table [dataSource]="data">
      <ng-container dtColumnDef="service" dtColumnAlign="text">
        <dt-header-cell *dtHeaderCellDef>Service name</dt-header-cell>
        <dt-cell *dtCellDef="let row">
          <dt-info-group>
            <dt-info-group-icon>
              <dt-icon name="apache-tomcat"></dt-icon>
            </dt-info-group-icon>
            <dt-info-group-title>{{ row.title }}</dt-info-group-title>
            {{ row.subtitle }}
          </dt-info-group>
        </dt-cell>
      </ng-container>

      <ng-container dtColumnDef="requests" dtColumnAlign="number">
        <dt-header-cell *dtHeaderCellDef>Requests</dt-header-cell>
        <dt-cell *dtCellDef="let row">{{ row.requests }}</dt-cell>
      </ng-container>

      <ng-container dtColumnDef="actions" dtColumnAlign="number">
        <dt-header-cell *dtHeaderCellDef>Actions</dt-header-cell>
        <dt-cell *dtCellDef="let row">
          <a dt-button variant="secondary">Service flow</a>
        </dt-cell>
      </ng-container>

      <dt-header-row
        *dtHeaderRowDef="['service', 'requests', 'actions']"
      ></dt-header-row>
      <dt-row
        *dtRowDef="let row; columns: ['service', 'requests', 'actions']"
      ></dt-row>
    </dt-table>
  `,
  // tslint:enable
})
export class TableButtonsExample {
  data: object[] = [
    {
      title: 'dev-BB: VerificationService',
      subtitle: 'dynatrace-dev-BB',
      requests: 45,
    },
    {
      title: 'dev-BB: BookingService',
      subtitle: 'dynatrace-dev-BB',
      requests: 10,
    },
    {
      title: 'dev-BB: easyTravel Business Backend',
      subtitle: 'dynatrace-dev-BB',
      requests: 19,
    },
    {
      title: 'dev: easyTravel Customer Frontend',
      subtitle: 'dynatrace-dev-CF',
      requests: 7,
    },
  ];
}
