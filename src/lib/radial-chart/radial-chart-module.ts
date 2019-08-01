import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtRadialChart } from './radial-chart';
import { DtRadialChartSeries } from './radial-chart-series';

@NgModule({
  imports: [CommonModule],
  exports: [DtRadialChart, DtRadialChartSeries],
  declarations: [DtRadialChart, DtRadialChartSeries],
})
export class DtRadialChartModule {}
