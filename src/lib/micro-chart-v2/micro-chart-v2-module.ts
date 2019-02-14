import { NgModule } from '@angular/core';
import { DtChartModule } from '@dynatrace/angular-components/chart';
import { DtMicroChartV2 } from './micro-chart-v2';
import { CommonModule } from '@angular/common';
import { DtMicroChartPointSVG } from './micro-chart-point';
import { DtFormattersModule } from '../formatters';
import { DtMicroChartLineSeriesSVG , DtMicroChartColumnSeriesSVG } from './series';
import { DtMicroChartLineSeries, DtMicroChartColumnSeries } from './public-api';

@NgModule({
  imports: [
    DtChartModule,
    CommonModule,
    DtFormattersModule,
  ],
  exports: [
    DtMicroChartV2,
    DtMicroChartLineSeries,
    DtMicroChartColumnSeries,
  ],
  declarations: [
    DtMicroChartV2,
    DtMicroChartLineSeries,
    DtMicroChartColumnSeries,
    DtMicroChartPointSVG,
    DtMicroChartLineSeriesSVG,
    DtMicroChartColumnSeriesSVG,
  ],
})
export class DtMicroChartV2Module { }
