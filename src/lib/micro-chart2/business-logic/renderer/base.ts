import { InjectionToken } from '@angular/core';
import { DtMicroChartLineSeriesData } from '../core/line';
import { DtMicroChartColumnSeriesData } from '../core/column';
import { DtMicroChartBarSeriesData } from '../core/bar';

export const DT_MICRO_CHART_RENDERER = new InjectionToken<DtMicroChartRenderer>(
  'DT_MICRO_CHART_RENDERER'
);

export abstract class DtMicroChartRenderer {
  // tslint:disable-next-line:no-any
  abstract createLineSeriesRenderData(data: DtMicroChartLineSeriesData): any;
  abstract createColumnSeriesRenderData(
    data: DtMicroChartColumnSeriesData
  ): any; // tslint:disable-line:no-any
  // tslint:disable-next-line:no-any
  abstract createBarSeriesRenderData(data: DtMicroChartBarSeriesData): any;
}
