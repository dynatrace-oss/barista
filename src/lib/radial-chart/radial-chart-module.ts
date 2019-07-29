import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtRadialChart } from './radial-chart';
import { DtRadialChartSeriesSVG } from './radial-chart-series';
import { DtRadialChartSeries } from './public-api/radial-chart-series';

@NgModule({
  imports: [CommonModule],
  exports: [DtRadialChart, DtRadialChartSeries],
  declarations: [DtRadialChart, DtRadialChartSeries, DtRadialChartSeriesSVG],
})
export class DtRadialChartModule {}
