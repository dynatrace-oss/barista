import { ScaleLinear, scaleLinear, ScaleBand, scaleBand } from 'd3-scale';
import { DtMicroChartSeriesData, DtMicroChartDomains, DtMicroChartUnifiedInputData, DtMicroChartExtremes } from './chart';
import { DtMicroChartConfig } from '../../micro-chart-config';
import { findExtremes } from '../../helper-functions';
import { DtMicroChartColumnSeries } from '../../public-api';
import { Series } from 'd3-shape';
import { isDefined } from '@dynatrace/angular-components/core';

export interface DtMicroChartColumnScales {
  x: ScaleBand<number>;
  y: ScaleLinear<number, number>;
}

export interface DtMicroChartColumnDataPoint {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DtMicroChartColumnSeriesData extends DtMicroChartSeriesData {
  points: DtMicroChartColumnDataPoint[];
  scales: DtMicroChartColumnScales;
  extremes?: DtMicroChartExtremes<DtMicroChartColumnDataPoint>;
}

/** Helper function to calculate a datapoint based on scales and domains. */
function calculatePoint(
  index: number,
  dp: number,
  domains: DtMicroChartDomains,
  scales: DtMicroChartColumnScales,
  dpStacked?: number
): DtMicroChartColumnDataPoint {
  // Bandwidth x is a unique string identifier.
  const x = scales.x(index) as number;
  let y;
  let height;

  // tslint:disable-next-line:prefer-conditional-expression
  if (!dpStacked) {
    // If the y resulting y value is 0, move the indicator up by one to accomodate for minimum height of 1.
    y = scales.y(domains.y.min) - scales.y(dp) > 0 ? scales.y(dp) : scales.y(dp) - 1;
    // Fall back to a minimum height of 1.
    height = scales.y(domains.y.min) - scales.y(dp) > 0 ? scales.y(domains.y.min) - scales.y(dp) : 1;
  } else {
    y = scales.y(dpStacked);
    height = scales.y(domains.y.min) - scales.y(dp);
  }
  const width = scales.x.bandwidth();

  return { x, y, height, width };
}

export function handleChartColumnSeries(
  width: number,
  series: DtMicroChartColumnSeries,
  domains: DtMicroChartDomains,
  config: DtMicroChartConfig,
  stack?: Array<Series<{ [key: string]: number }, string>>
): DtMicroChartColumnSeriesData {
  const scales = getScales(width, domains, config);
  const data = series._transformedData;
  // Calculate Min and Max values
  const { min, minIndex, max, maxIndex } = findExtremes<Array<number | null>>(
    data,
    (d) => d[1]
  );
  const minPoint = calculatePoint(minIndex, min[1], domains, scales);
  const maxPoint = calculatePoint(maxIndex, max[1], domains, scales);

  let transformedData: DtMicroChartColumnSeriesData = {
    scales,
    points: [],
  };

  if (stack) {
    const stackData = stack.find((stackedSeries) => stackedSeries.key === series._id);
    if (stackData) {
      transformedData.points = stackData.map((d, index) => {
        const d0 = d[0];
        const d1 = !isNaN(d[1]) ? d[1] : 0;
        return calculatePoint(index, d1 - d0, domains, scales, d1);
      });
    } else {
      throw new Error(`Stack data was not found for series: ${series._id}`);
    }
  } else {

    transformedData = {
      ...transformedData,
      points: data.map((dp, index) => calculatePoint(index, dp[1], domains, scales)),
      extremes: {
        min: minPoint,
        minAnchor: {
          // tslint:disable-next-line:no-magic-numbers
          x: minPoint.x + minPoint.width / 2,
          y: minPoint.y + minPoint.height,
        },
        minValue: min[1],
        max: maxPoint,
        maxAnchor: {
          // tslint:disable-next-line:no-magic-numbers
          x: maxPoint.x + maxPoint.width / 2,
          y: maxPoint.y,
        },
        maxValue: max[1],
      }
    };
  }
  return transformedData;
}

// export function handleChartColumnSeries(
//   width: number,
//   series: DtMicroChartColumnSeries,
//   domains: DtMicroChartDomains,
//   config: DtMicroChartConfig
// ): DtMicroChartColumnSeriesData {
//   const data = series._transformedData;

//   // if (series.isStacked) {
//   //   return handleStackedColumnSeries(width, domains, config)
//   // } else {
//   return handleSingleColumnSeries(width, domains, config, data);
//   // }
// }

// function handleSingleColumnSeries(
//   width: number,
//   domains: DtMicroChartDomains,
//   config: DtMicroChartConfig,
//   data: Map<number, number | null>
// ): DtMicroChartColumnSeriesData {
//   const scales = getScales(width, domains, config);
//   // Calculate Min and Max values
//   const { min, minIndex, max, maxIndex } = findExtremes(data);
//   const minPoint = calculatePoint(minIndex, min, domains, scales);
//   const maxPoint = calculatePoint(maxIndex, max, domains, scales);

//   const points: DtMicroChartColumnDataPoint[]  = [];
//   const iterator = data.entries();
//   let result = iterator.next();
//   while (!result.done) {
//     const [key, value] = result.value;
//     // TODO: check value for null correctly
//     points.push(calculatePoint(key, value!, domains, scales));
//     result = iterator.next();
//   }

//   const transformedData = {
//     points,
//     scales,
//     extremes: {
//       min: minPoint,
//       minAnchor: {
//         // tslint:disable-next-line:no-magic-numbers
//         x: minPoint.x + (minPoint.width / 2),
//         y: minPoint.y + minPoint.height,
//       },
//       minValue: min,
//       max: maxPoint,
//       maxAnchor: {
//         // tslint:disable-next-line:no-magic-numbers
//         x: maxPoint.x + (maxPoint.width / 2),
//         y: maxPoint.y,
//       },
//       maxValue: max,
//     },
//   };
//   return transformedData;
// }

function getScales(width: number, domains: DtMicroChartDomains, config: DtMicroChartConfig): DtMicroChartColumnScales {
  const x = scaleBand<number>()
    .range([0, width - config.marginLeft - config.marginRight])
    .paddingInner(0.5)
    .domain(new Array(domains.x.numberOfPoints).fill(1).map((_, i) => i));
  const y = scaleLinear()
    .range([config.height - config.marginTop - config.marginBottom, 0])
    .domain([domains.y.min, domains.y.max]);
  return { x, y };
}
