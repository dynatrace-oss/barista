import { InjectionToken } from '@angular/core';
import { DtMicroChartLineSeriesData } from '../core/line';
import { DtMicroChartColumnSeriesData } from '../core/column';
import { DtMicroChartBarSeriesData } from '../core/bar';

export const DT_MICRO_CHART_RENDERER = new InjectionToken<DtMicroChartRenderer>(
  'DT_MICRO_CHART_RENDERER',
);

export abstract class DtMicroChartRenderer {
  /** Create a renderable line series. This is an abstract function that gets overloaded by the various typed renderes. */
  // tslint:disable-next-line:no-any
  abstract createLineSeriesRenderData(data: DtMicroChartLineSeriesData): any;

  /** Create a renderable column series. This is an abstract function that gets overloaded by the various typed renderes. */
  abstract createColumnSeriesRenderData(
    data: DtMicroChartColumnSeriesData,
  ): any; // tslint:disable-line:no-any

  /** Create a renderable column series. This is an abstract function that gets overloaded by the various typed renderes. */
  // tslint:disable-next-line:no-any
  abstract createBarSeriesRenderData(data: DtMicroChartBarSeriesData): any;
}
