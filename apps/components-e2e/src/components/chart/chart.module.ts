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
import { DtChartModule } from '@dynatrace/barista-components/chart';
import { BasicChart } from './chart/chart';
import { ChartHighchartsUI } from './highcharts/chart-highcharts-ui';
import { PieChart } from './pie-chart/pie-chart';
import { Heatfield } from './heatfield/heatfield';
import {
  DT_UI_TEST_CONFIG,
  DT_DEFAULT_UI_TEST_CONFIG,
} from '@dynatrace/barista-components/core';

const routes: Route[] = [
  { path: '', component: BasicChart },
  { path: 'highcharts', component: ChartHighchartsUI },
  { path: 'heatfield', component: Heatfield },
  {
    path: 'selection-area',
    loadChildren: () =>
      import('./selection-area/selection-area.module').then(
        (m) => m.DtE2ESelectionAreaModule,
      ),
  },
  { path: 'pie', component: PieChart },
];

@NgModule({
  declarations: [BasicChart, ChartHighchartsUI, PieChart, Heatfield],
  imports: [CommonModule, RouterModule.forChild(routes), DtChartModule],
  exports: [],
  providers: [
    { provide: DT_UI_TEST_CONFIG, useValue: DT_DEFAULT_UI_TEST_CONFIG },
  ],
})
export class DtE2EChartModule {}
