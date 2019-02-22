import { DtMicroChartSeries, DtMicroChartLineSeries, DtMicroChartSeriesType, DtMicroChartColumnSeries } from '../../public-api';
import { ScaleLinear, ScaleBand, scaleBand, scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { handleChartLineSeries } from './line';
import { DtMicroChartConfig } from '../../micro-chart-config';
import { handleChartColumnSeries } from './column';

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

function reduceSeriesToChartDomains(aggregator: DtMicroChartDomains, series: DtMicroChartSeries, index?: number): DtMicroChartDomains {
  let xMin = aggregator.x.min;
  let xMax = aggregator.x.max;
  let yMin = aggregator.y.min;
  let yMax = aggregator.y.max;
  let xMaxNrOfPoints = aggregator.x.numberOfPoints;
  let yMaxNrOfPoints = aggregator.y.numberOfPoints;

  // TODO: Handle xMin/Max differently when we work with [number, number][]
  const [seriesXMin, seriesXMax] = [0, series.data.length];
  const [seriesYMin, seriesYMax] = extent(series.data);

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

  if (xMaxNrOfPoints < series.data.length) {
    xMaxNrOfPoints = series.data.length;
  }

  if (yMaxNrOfPoints < series.data.length) {
    yMaxNrOfPoints = series.data.length;
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
  const domains: DtMicroChartDomains = series.reduce(reduceSeriesToChartDomains, standardDomain);
  // const domains: DtMicroChartDomains = series.reduce(
  //   (aggr, val) => {
  //     aggr.x = getDomain([0, val.data.length - 1], aggr.x);
  //     aggr.y = getDomain([0, max(val.data)], aggr.y);
  //     return aggr;
  //   },
  //   { x: [], y: [] } as DtMicroChartDomains);
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

// function getDomain(data: number[], prevData: number[]): number[] {
//   const maxPrev = max(prevData);
//   const maxData = max(data);
//   const newMax = maxPrev && maxPrev > maxData ? maxPrev : maxData;

//   const minPrev = min(prevData);
//   const minData = min(data);
//   const newMin = minPrev && minPrev > minData ? minPrev : minData;
//   return [newMin, newMax];
// }
