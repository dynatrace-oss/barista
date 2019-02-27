import { NgModule } from '@angular/core';
import { DtChartModule } from '@dynatrace/angular-components/chart';
import { DtMicroChartV2 } from './micro-chart-v2';
import { CommonModule } from '@angular/common';
import { DtFormattersModule } from '../formatters';
import { DtMicroChartLineSeriesSVG , DtMicroChartColumnSeriesSVG, DtMicroChartBarSeriesSVG } from './series';
import { DtMicroChartLineSeries, DtMicroChartColumnSeries, DtMicroChartBarSeries, DtMicroChartMinLabel, DtMicroChartMaxLabel } from './public-api';
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
    DtMicroChartMaxLabel,
  ],
  declarations: [
    DtMicroChartV2,
    DtMicroChartLineSeries,
    DtMicroChartColumnSeries,
    DtMicroChartBarSeries,
    DtMicroChartLineSeriesSVG,
    DtMicroChartColumnSeriesSVG,
    DtMicroChartBarSeriesSVG,
    DtMicroChartMinLabel,
    DtMicroChartMaxLabel,
  ],
  providers: [
    {
      provide: DT_MICRO_CHART_RENDERER, useClass: DtMicroChartSvgRenderer,
    },
  ],
})
export class DtMicroChartV2Module { }
