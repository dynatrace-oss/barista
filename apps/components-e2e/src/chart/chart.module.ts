import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { DtChartModule } from '../../lib';
import { ChartUI } from './chart-ui';
import { ChartHighchartsUI } from './highcharts/chart-highcharts-ui';

const routes: Route[] = [
  { path: '', component: ChartUI },
  {
    path: 'selection-area',
    loadChildren: () =>
      import('./selection-area/selection-area.module').then(
        m => m.SelectionAreaModule,
      ),
  },
  { path: 'highcharts', component: ChartHighchartsUI },
];

@NgModule({
  declarations: [ChartUI, ChartHighchartsUI],
  imports: [CommonModule, RouterModule.forChild(routes), DtChartModule],
  exports: [],
  providers: [],
})
export class ChartModule {}
