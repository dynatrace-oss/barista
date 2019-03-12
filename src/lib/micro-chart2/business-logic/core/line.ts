import { ScaleLinear, scaleLinear } from 'd3-scale';
import { DtMicroChartSeriesData, DtMicroChartDomains, DtMicroChartUnifiedInputData, DtMicroChartExtremes } from './chart';
import { DtMicroChartConfig } from '../../micro-chart-config';
import { findExtremes } from '../../helper-functions';

export interface DtMicroChartLineScales {
  x: ScaleLinear<number, number>;
  y: ScaleLinear<number, number>;
}

export interface DtMicroChartLineDataPoint {
  x: number;
  y: number;
}

export interface DtMicroChartLineSeriesData extends DtMicroChartSeriesData {
  points: DtMicroChartLineDataPoint[];
  scales: DtMicroChartLineScales;
  extremes: DtMicroChartExtremes<DtMicroChartLineDataPoint>;
}

export function handleChartLineSeries(width: number, data: DtMicroChartUnifiedInputData, domains: DtMicroChartDomains, config: DtMicroChartConfig): DtMicroChartLineSeriesData {
  const { x, y } = getScales(width, domains, config);
  const { min, max } = findExtremes<Array<number|null>>(data, (d) => d[1]);
  const transformedData = {
    points: data.map((dp) => ({ x: x(dp[0]), y: y(dp[1]) })),
    scales: {
      x,
      y,
    },
    extremes: {
      min: { x: x(min[0]), y: y(min[1]), },
      minAnchor: { x: x(min[0]), y: y(min[1]), },
      minValue: min[1],
      max: { x: x(max[0]), y: y(max[1]), },
      maxAnchor: { x: x(max[0]), y: y(max[1]), },
      maxValue: max[1],
    },
  };
  return transformedData;
}

// export function handleChartLineSeries(width: number, data: DtMicroChartUnifiedInputData, domains: DtMicroChartDomains, config: DtMicroChartConfig): DtMicroChartLineSeriesData {
//   const { x, y } = getScales(width, domains, config);
//   const { min, max, minIndex, maxIndex } = findExtremes(data);

//   const points: DtMicroChartLineDataPoint[]  = [];
//   let index = 0;
//   const iterator = data.entries();
//   let result = iterator.next();
//   while (!result.done) {
//     const [key, value] = result.value;
//     points.push({
//       x: x(key),
//       y: y(value!),
//     });
//     index++;
//     result = iterator.next();
//   }
//   const transformedData = {
//     points,
//     scales: {
//       x,
//       y,
//     },
//     extremes: {
//       min: { x: x(minIndex), y: y(min), },
//       minAnchor: { x: x(minIndex), y: y(min), },
//       minValue: min,
//       max: { x: x(maxIndex), y: y(max), },
//       maxAnchor: { x: x(maxIndex), y: y(max), },
//       maxValue: max,
//     },
//   };
//   return transformedData;
// }

function getScales(width: number, domains: DtMicroChartDomains, config: DtMicroChartConfig): DtMicroChartLineScales {
  const x = scaleLinear()
    .range([0, width - config.marginLeft - config.marginRight])
    .domain([domains.x.min, domains.x.max]);

  const y = scaleLinear()
    .range([config.height - config.marginTop - config.marginBottom, 0])
    .domain([domains.y.min, domains.y.max]);
  return { x, y };
}
