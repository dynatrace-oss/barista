import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtChartModule } from '@dynatrace/angular-components/chart';

import { ChartSelectionAreaUi } from './selection-area-ui';

const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: ChartSelectionAreaUi,
  },
];

@NgModule({
  declarations: [ChartSelectionAreaUi],
  imports: [
    CommonModule,
    DtChartModule,
    DtButtonModule,
    RouterModule.forChild(routes),
  ],
})
export class SelectionAreaModule {}
