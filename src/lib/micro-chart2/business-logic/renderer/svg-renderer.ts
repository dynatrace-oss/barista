import {
  DtMicroChartLineSeriesData,
  DtMicroChartLineDataPoint,
} from '../core/line';
import { line } from 'd3-shape';
import { DtMicroChartRenderer } from './base';
import {
  DtMicroChartColumnSeriesData,
  DtMicroChartColumnDataPoint,
} from '../core/column';
import {
  DtMicroChartBarSeriesData,
  DtMicroChartBarDataPoint,
} from '../core/bar';
import { DtMicroChartExtremes } from '../core/chart';

export type SVGTextAnchor = 'start' | 'middle' | 'end';

export interface DtMicroChartLineSeriesSvgData {
  points: DtMicroChartLineDataPoint[];
  extremes: DtMicroChartExtremes<DtMicroChartLineDataPoint>;
  path: string;
  interpolatedPath: string;
}

export interface DtMicroChartColumnSeriesSvgData {
  points: DtMicroChartColumnDataPoint[];
  extremes?: DtMicroChartExtremes<DtMicroChartColumnDataPoint>;
  minHighlightRectangle?: DtMicroChartColumnDataPoint;
  maxHighlightRectangle?: DtMicroChartColumnDataPoint;
}

export interface DtMicroChartBarSeriesSvgData {
  points: DtMicroChartBarDataPoint[];
}

export type DtMicroChartRendererSeriesData =
  | DtMicroChartLineSeriesSvgData
  | DtMicroChartColumnSeriesSvgData
  | DtMicroChartBarSeriesSvgData;

export class DtMicroChartSvgRenderer extends DtMicroChartRenderer {
  /** Creates an svg renderable line series. */
  createLineSeriesRenderData(
    data: DtMicroChartLineSeriesData,
  ): DtMicroChartLineSeriesSvgData {
    const linePoints = data.points.map(dp => [dp.x, dp.y] as [number, number]);
    // Defined path
    const lineGenerator = line().defined(
      (dp: [number, number | null], index) =>
        dp[1] !== null && data.points[index].interpolated === undefined,
    );
    const path = lineGenerator(linePoints) || '';

    // Interpolated path
    const interpolatedLineGenerator = line().defined((_dp, index) => {
      const isInterpolated = data.points[index].interpolated === true;
      const nextIsInterpolated =
        data.points[index + 1] && data.points[index + 1].interpolated === true;
      const previousIsInterpolated =
        data.points[index - 1] && data.points[index - 1].interpolated === true;
      return isInterpolated || nextIsInterpolated || previousIsInterpolated;
    });
    const interpolatedPath = interpolatedLineGenerator(linePoints) || '';

    return {
      points: data.points,
      extremes: data.extremes,
      path,
      interpolatedPath,
    };
  }

  /** Creates an svg renderable column series. */
  createColumnSeriesRenderData(
    data: DtMicroChartColumnSeriesData,
  ): DtMicroChartColumnSeriesSvgData {
    const offset = 3;
    let renderData: DtMicroChartColumnSeriesSvgData = {
      points: data.points,
    };
    if (data.extremes) {
      const minHighlightRectangle = {
        x: data.extremes.min.x - offset,
        y: data.extremes.min.y - offset,
        // tslint:disable-next-line:no-magic-numbers
        width: data.extremes.min.width + offset * 2,
        // tslint:disable-next-line:no-magic-numbers
        height: data.extremes.min.height + offset * 2,
      };
      const maxHighlightRectangle = {
        x: data.extremes.max.x - offset,
        y: data.extremes.max.y - offset,
        // tslint:disable-next-line:no-magic-numbers
        width: data.extremes.max.width + offset * 2,
        // tslint:disable-next-line:no-magic-numbers
        height: data.extremes.max.height + offset * 2,
      };

      renderData = {
        ...renderData,
        extremes: data.extremes,
        minHighlightRectangle,
        maxHighlightRectangle,
      };
    }

    return renderData;
  }

  /** Creates an svg renderable bar series. */
  createBarSeriesRenderData(
    data: DtMicroChartBarSeriesData,
  ): DtMicroChartBarSeriesSvgData {
    return {
      points: data.points,
    };
  }
}
