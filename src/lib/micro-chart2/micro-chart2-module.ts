import { NgModule } from '@angular/core';
import { DtChartModule } from '@dynatrace/angular-components/chart';
import { DtMicroChart2 } from './micro-chart2';
import { CommonModule } from '@angular/common';
import { DtFormattersModule } from '@dynatrace/angular-components/formatters';
import {
  DtMicroChartLineSeriesSVG,
  DtMicroChartColumnSeriesSVG,
  DtMicroChartBarSeriesSVG,
} from './series';
import {
  DtMicroChartLineSeries,
  DtMicroChartColumnSeries,
  DtMicroChartBarSeries,
  DtMicroChartMinLabel,
  DtMicroChartMaxLabel,
  DtMicroChartXAxis,
  DtMicroChartYAxis,
  DtMicroChartStackContainer,
} from './public-api';
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
    DtMicroChart2,
    DtMicroChartLineSeries,
    DtMicroChartColumnSeries,
    DtMicroChartBarSeries,
    DtMicroChartMinLabel,
    DtMicroChartMaxLabel,
    DtMicroChartXAxis,
    DtMicroChartYAxis,
    DtMicroChartStackContainer,
  ],
  declarations: [
    DtMicroChart2,
    DtMicroChartLineSeries,
    DtMicroChartColumnSeries,
    DtMicroChartBarSeries,
    DtMicroChartLineSeriesSVG,
    DtMicroChartColumnSeriesSVG,
    DtMicroChartBarSeriesSVG,
    DtMicroChartMinLabel,
    DtMicroChartMaxLabel,
    DtMicroChartXAxis,
    DtMicroChartYAxis,
    DtMicroChartStackContainer,
  ],
  providers: [
    {
      provide: DT_MICRO_CHART_RENDERER, useClass: DtMicroChartSvgRenderer,
    },
  ],
})
export class DtMicroChart2Module { }
