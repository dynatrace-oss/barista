import { NgModule } from '@angular/core';
import { DtChartModule } from '@dynatrace/angular-components/chart';
import { DtMicroChartV2 } from './micro-chart-v2';
import { CommonModule } from '@angular/common';
import { DtMicroChartPointSVG } from './micro-chart-point';
import { DtFormattersModule } from '../formatters';
import { DtMicroChartLineSeriesSVG , DtMicroChartColumnSeriesSVG, DtMicroChartBarSeriesSVG } from './series';
import { DtMicroChartLineSeries, DtMicroChartColumnSeries, DtMicroChartBarSeries, DtMicroChartMinLabel } from './public-api';
import { DT_MICRO_CHART_RENDERER } from './business-logic/renderer/base';
import { DtMicroChartSvgRenderer } from './business-logic/renderer/svg-renderer';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  imports: [
    DtChartModule,
    CommonModule,
    DtFormattersModule,
    PortalModule,
  ],
  exports: [
    DtMicroChartV2,
    DtMicroChartLineSeries,
    DtMicroChartColumnSeries,
    DtMicroChartBarSeries,
    DtMicroChartMinLabel,
  ],
  declarations: [
    DtMicroChartV2,
    DtMicroChartLineSeries,
    DtMicroChartColumnSeries,
    DtMicroChartBarSeries,
    DtMicroChartPointSVG,
    DtMicroChartLineSeriesSVG,
    DtMicroChartColumnSeriesSVG,
    DtMicroChartBarSeriesSVG,
    DtMicroChartMinLabel,
  ],
  providers: [
    {
      provide: DT_MICRO_CHART_RENDERER, useClass: DtMicroChartSvgRenderer,
    },
  ],
})
export class DtMicroChartV2Module { }
