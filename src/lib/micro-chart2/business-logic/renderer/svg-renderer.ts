import { DtMicroChartLineSeriesData, DtMicroChartLineDataPoint } from '../core/line';
import { line } from 'd3-shape';
import { DtMicroChartRenderer } from './base';
import { DtMicroChartColumnSeriesData, DtMicroChartColumnDataPoint } from '../core/column';
import { DtMicroChartBarSeriesData } from '../core/bar';
import { DtMicroChartExtremes } from '../core/chart';

export type SVGTextAnchor = 'start' | 'middle' | 'end';

export interface DtMicroChartBaseSeriesSvgData { }

export interface DtMicroChartLineSeriesSvgData extends DtMicroChartBaseSeriesSvgData {
  points: DtMicroChartLineDataPoint[];
  extremes: DtMicroChartExtremes<DtMicroChartLineDataPoint>;
  path: string;
}

export interface DtMicroChartColumnSeriesSvgData extends DtMicroChartBaseSeriesSvgData {
  points: DtMicroChartColumnDataPoint[];
  extremes: DtMicroChartExtremes<DtMicroChartColumnDataPoint>;
  minHighlightRectangle: DtMicroChartColumnDataPoint;
  maxHighlightRectangle: DtMicroChartColumnDataPoint;
}

export interface DtMicroChartBarSeriesSvgData extends DtMicroChartBaseSeriesSvgData {
  points: DtMicroChartColumnDataPoint[];
}

export type DtMicroChartRendererSeriesData =
  DtMicroChartLineSeriesSvgData |
  DtMicroChartColumnSeriesSvgData |
  DtMicroChartBarSeriesSvgData;

export class DtMicroChartSvgRenderer extends DtMicroChartRenderer {

  createLineSeriesRenderData(data: DtMicroChartLineSeriesData): DtMicroChartLineSeriesSvgData {
    const lineGenerator = line();
    const linePoints = data.points.map((dp) => [dp.x, dp.y] as [number, number]);
    const path = lineGenerator(linePoints) || '';
    return {
      points: data.points,
      extremes: data.extremes,
      path,
    };
  }

  createColumnSeriesRenderData(data: DtMicroChartColumnSeriesData): DtMicroChartColumnSeriesSvgData {
    const offset = 3;
    const minHighlightRectangle = {
      x: data.extremes.min.x! - offset,
      y: data.extremes.min.y! - offset,
      // tslint:disable-next-line:no-magic-numbers
      width: data.extremes.min.width + (offset * 2),
      // tslint:disable-next-line:no-magic-numbers
      height: data.extremes.min.height + (offset * 2),
    };
    const maxHighlightRectangle = {
      x: data.extremes.max.x! - offset,
      y: data.extremes.max.y! - offset,
      // tslint:disable-next-line:no-magic-numbers
      width: data.extremes.max.width + (offset * 2),
      // tslint:disable-next-line:no-magic-numbers
      height: data.extremes.max.height + (offset * 2),
    };
    return {
      points: data.points,
      extremes: data.extremes,
      minHighlightRectangle,
      maxHighlightRectangle,
    };
  }

  createBarSeriesRenderData(data: DtMicroChartBarSeriesData): DtMicroChartBarSeriesSvgData {
    return {
      points: data.points,
    };
  }
}
