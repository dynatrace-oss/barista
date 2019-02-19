import { InjectionToken } from '@angular/core';
import { DtMicroChartLineSeriesData } from '../core/line';

export const DT_MICRO_CHART_RENDERER = new InjectionToken<DtMicroChartRenderer>('DT_MICRO_CHART_RENDERER');

export abstract class DtMicroChartRenderer {
  abstract createLineSeriesRenderData(data: DtMicroChartLineSeriesData): any;
}
