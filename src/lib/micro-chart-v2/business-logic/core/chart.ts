import { DtMicroChartSeries, DtMicroChartLineSeries, DtMicroChartSeriesType, DtMicroChartColumnSeries, DtMicroChartBarSeries } from '../../public-api';
import { extent } from 'd3-array';
import { DtMicroChartConfig } from '../../micro-chart-config';
import { handleChartLineSeries } from './line';
import { handleChartColumnSeries } from './column';
import { handleChartBarSeries } from './bar';

// TODO: adjust datastructure to find eventually shared scales (multiple axis, ...)
export interface DtMicroChartDomains {
  x: { min: number; max: number; numberOfPoints: number };
  y: { min: number; max: number; numberOfPoints: number };
}

export interface DtMicroChartSeriesData {
  type: DtMicroChartSeriesType;
  points: any[];
  scales: {
    x: any;
    y: any;
  };
}

export function unifySeriesData(series: DtMicroChartSeries): DtMicroChartSeries {
  const data = series.data;
  const transform = data && data.length && !(data[0] instanceof Array);
  series._transformedData = transform ?
    (data as number[]).map((dataPoint, index) => [index, dataPoint]) :
    (data as number[][]).slice(0);
  return series;
}

export function reduceSeriesToChartDomains(aggregator: DtMicroChartDomains, series: DtMicroChartSeries): DtMicroChartDomains {
  let xMin = aggregator.x.min;
  let xMax = aggregator.x.max;
  let yMin = aggregator.y.min;
  let yMax = aggregator.y.max;
  let xMaxNrOfPoints = aggregator.x.numberOfPoints;
  let yMaxNrOfPoints = aggregator.y.numberOfPoints;

  const data = series._transformedData;
  const [seriesXMin, seriesXMax] = extent(data, (d) => d[0]);
  const [seriesYMin, seriesYMax] = extent(data, (d) => d[1]);
  // TODO: find distinct x Values

  // Find extents over all series provided
  if (seriesXMin < xMin) {
    xMin = seriesXMin;
  }
  if (seriesXMax > xMax) {
    xMax = seriesXMax;
  }
  if (seriesYMin < yMin) {
    yMin = seriesYMin;
  }
  if (seriesYMax > yMax) {
    yMax = seriesYMax;
  }

  if (xMaxNrOfPoints < data.length) {
    xMaxNrOfPoints = data.length;
  }

  if (yMaxNrOfPoints < data.length) {
    yMaxNrOfPoints = data.length;
  }

  return {
    x: {
      min: xMin,
      max: xMax,
      numberOfPoints: xMaxNrOfPoints,
    },
    y: {
      min: yMin,
      max: yMax,
      numberOfPoints: yMaxNrOfPoints,
    },
  };
}

export function handleChartData(width: number, series: DtMicroChartSeries[], config: DtMicroChartConfig): DtMicroChartSeriesData[] {
  // TODO: this needs some smarts
  const standardDomain: DtMicroChartDomains = {
    x: {
      min: Infinity,
      max: -Infinity,
      numberOfPoints: -Infinity,
    },
    y: {
      min: Infinity,
      max: -Infinity,
      numberOfPoints: -Infinity,
    },
  };
  const domains: DtMicroChartDomains = series
    .map((s) => unifySeriesData(s))
    .reduce(reduceSeriesToChartDomains, standardDomain);
  return series.map((s) => handleChartSeries(width, s, domains, config));
}

export function handleChartSeries(width: number, series: DtMicroChartSeries, domains: DtMicroChartDomains, config: DtMicroChartConfig): DtMicroChartSeriesData {
  switch (series.type) {
    case 'column':
      return handleChartColumnSeries(width, series as DtMicroChartColumnSeries, domains, config);
    case 'bar':
      return handleChartBarSeries(width, series as DtMicroChartBarSeries, domains, config);
    case 'line':
    default:
      return handleChartLineSeries(width, series as DtMicroChartLineSeries, domains, config);
  }
}
