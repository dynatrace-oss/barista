import { DtMicroChartLineSeriesData } from '../core/line';
import { line } from 'd3-shape';
import { DtMicroChartRenderer } from './base';
import { DtMicroChartSeriesType } from '../../public-api';
import { DtMicroChartColumnSeriesData } from '../core/column';

export interface DtMicroChartLineSeriesSvgData {
  type: DtMicroChartSeriesType;
  points: { x: number; y: number; }[];
  path: string;
}

export interface DtMicroChartColumnSeriesSvgData {
  type: DtMicroChartSeriesType;
  points: { x: number; y: number; height: number; width: number; }[];
}

export class DtMicroChartSvgRenderer extends DtMicroChartRenderer {

  createLineSeriesRenderData(data: DtMicroChartLineSeriesData): DtMicroChartLineSeriesSvgData {
    const lineGenerator = line()
        .x((d) => d.x)
        .y((d) => d.y);
    const path = lineGenerator(data.points) || '';
    return {
      type: 'line',
      points: data.points,
      path,
    };
  }

  createColumnSeriesRenderData(data: DtMicroChartColumnSeriesData): DtMicroChartColumnSeriesSvgData {
    return {
      type: 'column',
      points: data.points,
    };
  }
}
