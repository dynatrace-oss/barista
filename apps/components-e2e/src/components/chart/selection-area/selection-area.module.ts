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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtChartModule } from '@dynatrace/barista-components/chart';

import { DtE2ESelectionArea } from './selection-area';
import { DtE2ERange } from './range/range';
import { DataService } from '../../../services/data.service';
import { DtE2ETimestamp } from './timestamp/timestamp';

const routes: Route[] = [
  {
    path: '',
    component: DtE2ESelectionArea,
  },
  {
    path: 'range',
    component: DtE2ERange,
  },
  {
    path: 'timestamp',
    component: DtE2ETimestamp,
  },
];

@NgModule({
  declarations: [DtE2ESelectionArea, DtE2ERange, DtE2ETimestamp],
  imports: [
    CommonModule,
    DtChartModule,
    DtButtonModule,
    RouterModule.forChild(routes),
  ],
  providers: [DataService],
})
export class DtE2ESelectionAreaModule {}
