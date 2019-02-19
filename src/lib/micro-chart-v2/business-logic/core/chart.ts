import { DtMicroChartSeries, DtMicroChartLineSeries, DtMicroChartSeriesType, DtMicroChartColumnSeries } from '../../public-api';
import { ScaleLinear, ScaleBand, scaleBand, scaleLinear } from 'd3-scale';
import { max, min } from 'd3-array';
import { handleChartLineSeries } from './line';
import { DtMicroChartConfig } from '../../micro-chart-config';
import { handleChartColumnSeries } from './column';

// TODO: adjust datastructure to find eventually shared scales (multiple axis, ...)
export interface DtMicroChartDomains {
  // x: { min: number; max: number; nrOfPoints: number; };
  x: number[];
  y: number[];
}

export interface DtMicroChartSeriesData {
  type: DtMicroChartSeriesType;
  points: any[];
  scales: {
    x: any;
    y: any;
  };
}

export function handleChartData(width: number, series: DtMicroChartSeries[], config: DtMicroChartConfig): DtMicroChartSeriesData[] {
  // TODO: this needs some smarts
  const domains: DtMicroChartDomains = series.reduce(
    (aggr, val) => {
      aggr.x = getDomain([0, val.data.length - 1], aggr.x);
      aggr.y = getDomain([0, max(val.data)], aggr.y);
      return aggr;
    },
    { x: [], y: [] } as DtMicroChartDomains);
  return series.map((s) => handleChartSeries(width, s, domains, config));
}

export function handleChartSeries(width: number, series: DtMicroChartSeries, domains: DtMicroChartDomains, config: DtMicroChartConfig): DtMicroChartSeriesData {
  switch (series.type) {
    case 'column': 
      return handleChartColumnSeries(width, series as DtMicroChartColumnSeries, domains, config);
    case 'line':
    default:
      return handleChartLineSeries(width, series as DtMicroChartLineSeries, domains, config);
  }
}

function getDomain(data: number[], prevData: number[]): number[] {
  const maxPrev = max(prevData);
  const maxData = max(data);
  const newMax = maxPrev && maxPrev > maxData ? maxPrev : maxData;

  const minPrev = min(prevData);
  const minData = min(data);
  const newMin = minPrev && minPrev > minData ? minPrev : minData;
  return [newMin, newMax];
}