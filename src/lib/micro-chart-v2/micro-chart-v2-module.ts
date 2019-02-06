import { NgModule } from '@angular/core';
import { DtChartModule } from '@dynatrace/angular-components/chart';
import { DtMicroChartV2 } from './micro-chart-v2';
import { CommonModule } from '@angular/common';
import { DtMicroChartPoint } from './micro-chart-point';
import { DtFormattersModule } from '../formatters';
import { DtMicroChartLineSeriesInternal } from './series';
import { DtMicroChartLineSeries } from './public-api';

@NgModule({
  imports: [
    DtChartModule,
    CommonModule,
    DtFormattersModule,
  ],
  exports: [
    DtMicroChartV2,
    DtMicroChartLineSeries,
    // DtMicroChartColumnSeries,
  ],
  declarations: [
    DtMicroChartV2,
    DtMicroChartLineSeries,
    // DtMicroChartColumnSeries,
    DtMicroChartPoint,
    DtMicroChartLineSeriesInternal,
  ],
})
export class DtMicroChartV2Module { }
