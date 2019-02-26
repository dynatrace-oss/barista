import { DtMicroChartLineSeriesData } from '../core/line';
import { line } from 'd3-shape';
import { DtMicroChartRenderer } from './base';
import { DtMicroChartSeriesType } from '../../public-api';
import { DtMicroChartColumnSeriesData } from '../core/column';
import { DtMicroChartBarSeriesData } from '../core/bar';

export interface DtMicroChartBaseSeriesSvgData {
  publicSeriesId: number;
  type: DtMicroChartSeriesType;
}

export interface DtMicroChartLineSeriesSvgData extends DtMicroChartBaseSeriesSvgData {
  points: Array<{ x: number; y: number }>;
  path: string;
}

export interface DtMicroChartColumnSeriesSvgData extends DtMicroChartBaseSeriesSvgData {
  points: Array<{ x: number; y: number; height: number; width: number }>;
}

export interface DtMicroChartBarSeriesSvgData extends DtMicroChartBaseSeriesSvgData {
  points: Array<{ x: number; y: number; height: number; width: number }>;
}

export class DtMicroChartSvgRenderer extends DtMicroChartRenderer {

  createLineSeriesRenderData(data: DtMicroChartLineSeriesData): DtMicroChartLineSeriesSvgData {
    const lineGenerator = line()
        .x((d) => d.x)
        .y((d) => d.y);
    const path = lineGenerator(data.points) || '';
    return {
      type: 'line',
      publicSeriesId: data.publicSeriesId,
      points: data.points,
      path,
    };
  }

  createColumnSeriesRenderData(data: DtMicroChartColumnSeriesData): DtMicroChartColumnSeriesSvgData {
    return {
      type: 'column',
      publicSeriesId: data.publicSeriesId,
      points: data.points,
    };
  }

  createBarSeriesRenderData(data: DtMicroChartBarSeriesData): DtMicroChartBarSeriesSvgData {
    return {
      type: 'bar',
      publicSeriesId: data.publicSeriesId,
      points: data.points,
    };
  }
}
