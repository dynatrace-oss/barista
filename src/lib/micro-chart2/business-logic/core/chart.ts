import {
  DtMicroChartSeries,
  DtMicroChartSeriesType,
  DtMicroChartAxis,
} from '../../public-api';
import { extent } from 'd3-array';

export type DtMicroChartUnifiedInputData = Array<[number, number|null]>;

// TODO: adjust datastructure to find eventually shared scales (multiple axis, ...)
export interface DtMicroChartDomains {
  x: { min: number; max: number; numberOfPoints: number };
  y: { min: number; max: number; numberOfPoints: number };
}
export interface DtMicroChartExtremes<T> {
  min: T;
  minValue: number | null;
  minAnchor: { x: number; y: number };
  max: T;
  maxValue: number | null;
  maxAnchor: { x: number; y: number };
}
export interface DtMicroChartIdentification {
  publicSeriesId: number;
  type: DtMicroChartSeriesType;
}

export interface DtMicroChartDataPoint {
  x: number;
  y: number | null;
  interpolated?: boolean;
}

/** Unify the series data to a map where the x value is the key and the y value is the value in the map. */
export function unifySeriesData(data: Array<number|null> | Array<[number, number|null]>): DtMicroChartDataPoint[] {
  const transform = data && data.length && !(data[0] instanceof Array);
  return transform ?
    (data as Array<number|null>).map((dataPoint, index) => ({x: index, y: dataPoint})) :
    (data as Array<[number, number|null]>).map(([x, y]) => ({ x, y }));
}

export function reduceSeriesToChartDomains(aggregator: DtMicroChartDomains, series: DtMicroChartSeries): DtMicroChartDomains {
  let xMin = aggregator.x.min;
  let xMax = aggregator.x.max;
  let yMin = aggregator.y.min;
  let yMax = aggregator.y.max;
  let xMaxNrOfPoints = aggregator.x.numberOfPoints;
  let yMaxNrOfPoints = aggregator.y.numberOfPoints;

  const data = series._transformedData;
  const [seriesXMin, seriesXMax] = extent(data, (d) => d.x);
  const [seriesYMin, seriesYMax] = extent(data, (d) => d.y);
  // TODO: find distinct x Values

  // Find extents over all series provided
  if (seriesXMin !== undefined && seriesXMin < xMin) {
    xMin = seriesXMin;
  }
  if (seriesXMax !== undefined && seriesXMax > xMax) {
    xMax = seriesXMax;
  }
  if (seriesYMin !== undefined && seriesYMin < yMin) {
    yMin = seriesYMin;
  }
  if (seriesYMax !== undefined && seriesYMax > yMax) {
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

/** Create chart domains for all combined series. */
export function createChartDomains(series: DtMicroChartSeries[]): DtMicroChartDomains {
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
  return series
    .reduce(reduceSeriesToChartDomains, standardDomain);
}

/** Axis can move the chart domains. Calculate the extents of the configured axis and apply it to the domains. */
export function applyAxesExtentsToDomain(axes: DtMicroChartAxis[], domains: DtMicroChartDomains): DtMicroChartDomains {
  let xAxisMin;
  let xAxisMax;
  let yAxisMin;
  let yAxisMax;

  // Iterate the axis and determine the minimum and maximum values for each axis.
  for (const axis of axes) {
    if (axis._orientation === 'x') {
      if (axis.min < xAxisMin || xAxisMin === undefined) {
        xAxisMin = axis.min;
      }
      if (axis.max < xAxisMax || xAxisMax === undefined) {
        xAxisMax = axis.max;
      }
    }
    if (axis._orientation === 'y') {
      if (axis.min < yAxisMin || yAxisMin === undefined) {
        yAxisMin = axis.min;
      }
      if (axis.max < yAxisMax || yAxisMax === undefined) {
        yAxisMax = axis.max;
      }
    }
  }

  return {
    x: {
      min: xAxisMin !== undefined ? xAxisMin : domains.x.min,
      max: xAxisMax !== undefined ? xAxisMax : domains.x.max,
      numberOfPoints: domains.x.numberOfPoints,
    },
    y: {
      min: yAxisMin !== undefined ? yAxisMin : domains.y.min,
      max: yAxisMax !== undefined ? yAxisMax : domains.y.max,
      numberOfPoints: domains.y.numberOfPoints,
    },
  };
}
