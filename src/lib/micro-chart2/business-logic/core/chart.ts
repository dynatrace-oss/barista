import {
  DtMicroChartSeries,
  DtMicroChartSeriesType,
  DtMicroChartAxis,
  DtMicroChartStackableSeries,
} from '../../public-api';
import { extent } from 'd3-array';
import { sumNullable } from '../../helper-functions';
import { isDefined } from '@dynatrace/angular-components/core';

export type DtMicroChartUnifiedInputData = number[][];

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

export interface DtMicroChartSeriesData {
  points: any[];
  scales: {
    x: any;
    y: any;
  };
}

export function unifySeriesData(data: Array<number|null> | number[][]): number[][] {
  const transform = data && data.length && !(data[0] instanceof Array);
  return transform ?
    (data as number[]).map((dataPoint, index) => [index, dataPoint]) :
    (data as number[][]).slice(0);
}

// /** Unify the series data to a map where the x value is the key and the y value is the value in the map. */
// export function unifySeriesData(data: Array<number|null> | number[][]): Map<number, number> {
//   const hasImplicitX = data && data.length && !(data[0] instanceof Array);

//   const mappedData = new Map<number, number>();
//   if (hasImplicitX) {
//     (data as number[]).forEach((dataPoint, index) => {
//       mappedData.set(index, dataPoint);
//     });
//   } else {
//     (data as number[][]).forEach((dataPoints) => {
//       mappedData.set(dataPoints[0], dataPoints[1]);
//     });
//   }

//   return mappedData;
// }

/** extends the given domain if necessary with the data */
// export function extendDomain(data: number[][], domain: DtMicroChartDomains): DtMicroChartDomains {

//   let xMin = domain.x.min;
//   let xMax = domain.x.max;
//   let xMaxNrOfPoints = domain.x.numberOfPoints;
//   let yMin = domain.y.min;
//   let yMax = domain.y.max;
//   let yMaxNrOfPoints = domain.y.numberOfPoints;

//   const dataArr = Array.from(data);
//   const [seriesXMin, seriesXMax] = extent(dataArr, (d) => d[0]);
//   const [seriesYMin, seriesYMax] = extent(dataArr, (d) => d[1]);
//   // TODO: find distinct x Values

//   if (seriesXMin !== undefined && seriesXMin < xMin) {
//     xMin = seriesXMin;
//   }
//   if (seriesXMax !== undefined && seriesXMax > xMax) {
//     xMax = seriesXMax;
//   }
//   if (seriesYMin !== undefined && seriesYMin < yMin) {
//     yMin = seriesYMin;
//   }
//   if (seriesYMax !== undefined && seriesYMax > yMax) {
//     yMax = seriesYMax;
//   }

//   if (xMaxNrOfPoints < data.length) {
//     xMaxNrOfPoints = data.length;
//   }

//   if (yMaxNrOfPoints < data.length) {
//     yMaxNrOfPoints = data.length;
//   }

//   return {
//     x: {
//       min: xMin,
//       max: xMax,
//       numberOfPoints: xMaxNrOfPoints,
//     },
//     y: {
//       min: yMin,
//       max: yMax,
//       numberOfPoints: yMaxNrOfPoints,
//     },
//   };
// }

// export function extendDomainWithStacks(stacks: Map<number, Map<number, number | null>>, domain: DtMicroChartDomains)
//   : DtMicroChartDomains {

//   if (stacks.size === 0) {
//     return domain;
//   }

//   let newDomain = domain;

//   const stackIds = stacks.keys();
//   let stackIdResult = stackIds.next();
//   while (!stackIdResult.done) {
//     const stackId = stackIdResult.value;
//     newDomain = extendDomain(stacks.get(stackId)!, newDomain);
//     stackIdResult = stackIds.next();
//   }

//   return newDomain;
// }

// /** Create chart domains for all combined series. */
// export function createChartDomains(series: DtMicroChartSeries[]): DtMicroChartDomains {
//   // TODO: this needs some smarts
//   const standardDomain: DtMicroChartDomains = {
//     x: {
//       min: Infinity,
//       max: -Infinity,
//       numberOfPoints: -Infinity,
//     },
//     y: {
//       min: Infinity,
//       max: -Infinity,
//       numberOfPoints: -Infinity,
//     },
//   };
//   let domain = standardDomain;
//   // Map that holds a map for each stackContainer containing the summed values for a key (xAxis)
//   const stacks = new Map<number, Map<number, number | null>>();

//   series.forEach((s) => {
//     // check whether the series is stacked
//     const isStacked = (s instanceof DtMicroChartStackableSeries) &&
//       s.isStacked &&
//       !s._stackedContainer.disabled;

//     if (isStacked) {
//       const stackableSeries = s as DtMicroChartStackableSeries;
//       const stackId = stackableSeries._stackedContainer._stackId;
//       // check whether we already have a map entry for the given stackId
//       const summedValuesForStack = stacks.has(stackId) ? stacks.get(stackId)! : new Map<number, number | null>();

//       const entries = s._transformedData.entries();
//       let result = entries.next();
//       while (!result.done) {
//         const [key, value] = result.value;
//         const prevSum = summedValuesForStack.has(key) ? summedValuesForStack.get(key)! : null;

//         const newSum = sumNullable(prevSum, value);
//         summedValuesForStack.set(key, newSum);
//         result = entries.next();
//       }

//       stacks.set(stackId, summedValuesForStack);

//     } else {
//       domain = extendDomain(s._transformedData, domain);
//     }
//   });

//   return extendDomainWithStacks(stacks, domain);

// }

// /** Axis can move the chart domains. Calculate the extents of the configured axis and apply it to the domains. */
// export function applyAxesExtentsToDomain(axes: DtMicroChartAxis[], domains: DtMicroChartDomains): DtMicroChartDomains {
//   let xAxisMin;
//   let xAxisMax;
//   let yAxisMin;
//   let yAxisMax;

//   // Iterate the axis and determine the minimum and maximum values for each axis.
//   for (const axis of axes) {
//     if (axis._orientation === 'x') {
//       if (isDefined(axis.min) && (axis.min < xAxisMin || xAxisMin === undefined)) {
//         xAxisMin = axis.min;
//       }
//       if (isDefined(axis.max) && (axis.max < xAxisMax || xAxisMax === undefined)) {
//         xAxisMax = axis.max;
//       }
//     }
//     if (axis._orientation === 'y') {
//       if (isDefined(axis.min) && (axis.min < yAxisMin || yAxisMin === undefined)) {
//         yAxisMin = axis.min;
//       }
//       if (isDefined(axis.max) && (axis.max < yAxisMax || yAxisMax === undefined)) {
//         yAxisMax = axis.max;
//       }
//     }
//   }

//   return {
//     x: {
//       min: xAxisMin !== undefined ? xAxisMin : domains.x.min,
//       max: xAxisMax !== undefined ? xAxisMax : domains.x.max,
//       numberOfPoints: domains.x.numberOfPoints,
//     },
//     y: {
//       min: yAxisMin !== undefined ? yAxisMin : domains.y.min,
//       max: yAxisMax !== undefined ? yAxisMax : domains.y.max,
//       numberOfPoints: domains.y.numberOfPoints,
//     },
//   };
// }

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
      if (axis.min !== undefined && (axis.min < xAxisMin || xAxisMin === undefined)) {
        xAxisMin = axis.min;
      }
      if (axis.max !== undefined && (axis.max < xAxisMax || xAxisMax === undefined)) {
        xAxisMax = axis.max;
      }
    }
    if (axis._orientation === 'y') {
      if (axis.min !== undefined && (axis.min < yAxisMin || yAxisMin === undefined)) {
        yAxisMin = axis.min;
      }
      if (axis.max !== undefined && (axis.max < yAxisMax || yAxisMax === undefined)) {
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
