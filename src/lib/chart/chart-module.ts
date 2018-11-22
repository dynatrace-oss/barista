import { NgModule } from '@angular/core';
import { DtChart } from './chart';
import { CommonModule } from '@angular/common';
import { DtLoadingDistractorModule } from '@dynatrace/angular-components/loading-distractor';
import { DtChartHeatfield } from './heatfield/chart-heatfield';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  imports: [
    CommonModule,
    DtLoadingDistractorModule,
    OverlayModule,
  ],
  exports: [
    DtChart,
    DtChartHeatfield,
  ],
  declarations: [
    DtChart,
    DtChartHeatfield,
  ],
})
export class DtChartModule { }
