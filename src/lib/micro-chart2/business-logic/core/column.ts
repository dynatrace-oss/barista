import { ScaleLinear, scaleLinear, ScaleBand, scaleBand } from 'd3-scale';
import { DtMicroChartSeriesData, DtMicroChartDomains, DtMicroChartUnifiedInputData, DtMicroChartExtremes } from './chart';
import { DtMicroChartConfig } from '../../micro-chart-config';
import { findExtremes } from '../../helper-functions';
import { DtMicroChartColumnSeries } from '../../public-api';

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
  dataPoint: number,
  domains: DtMicroChartDomains,
  scales: DtMicroChartColumnScales,
  isStacked: boolean = false
): DtMicroChartColumnDataPoint {
  // Bandwidth x is a unique string identifier.
  const x = scales.x(index) as number;
  let y;
  if (!isStacked) {
    // If the y resulting y value is 0, move the indicator up by one to accomodate for minimum height of 1.
    y =
    scales.y(domains.y.min) - scales.y(dataPoint) > 0
      ? scales.y(dataPoint)
      : scales.y(dataPoint) - 1;
  } else {
    y = scales.y(dataPoint);
  }
  const width = scales.x.bandwidth();
  // Fall back to a minimum height of 1.
  const height =
    scales.y(domains.y.min) - scales.y(dataPoint) > 0
      ? scales.y(domains.y.min) - scales.y(dataPoint)
      : 1;

  return { x, y, height, width };
}

export function handleChartColumnSeries(width: number, series: DtMicroChartColumnSeries, domains: DtMicroChartDomains, config: DtMicroChartConfig): DtMicroChartColumnSeriesData {
  const scales = getScales(width, domains, config);
  const data = series._transformedData;
  // Calculate Min and Max values
  const { min, minIndex, max, maxIndex } = findExtremes<Array<number|null>>(data, (d) => d[1]);
  const minPoint = calculatePoint(minIndex, min[1], domains, scales);
  const maxPoint = calculatePoint(maxIndex, max[1], domains, scales);

  const isStacked = false;

  const transformedData = {
    points: data.map((dp, index) => calculatePoint(index, dp[1], domains, scales, isStacked)),
    scales,
    extremes: {
      min: minPoint,
      minAnchor: {
        // tslint:disable-next-line:no-magic-numbers
        x: minPoint.x + (minPoint.width / 2),
        y: minPoint.y + minPoint.height,
      },
      minValue: min[1],
      max: maxPoint,
      maxAnchor: {
        // tslint:disable-next-line:no-magic-numbers
        x: maxPoint.x + (maxPoint.width / 2),
        y: maxPoint.y,
      },
      maxValue: max[1],
    },
  };
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
