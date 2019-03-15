import { ScaleLinear, scaleLinear, ScaleBand, scaleBand } from 'd3-scale';
import { DtMicroChartSeriesData, DtMicroChartDomains, DtMicroChartUnifiedInputData } from './chart';
import { DtMicroChartConfig } from '../../micro-chart-config';
import { Series } from 'd3-shape';
import { DtMicroChartBarSeries } from '../../public-api';

export interface DtMicroChartBarScales {
  x: ScaleLinear<number, number>;
  y: ScaleBand<number>;
}

export interface DtMicroChartBarDataPoint {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DtMicroChartBarSeriesData extends DtMicroChartSeriesData {
  points: DtMicroChartBarDataPoint[];
  scales: DtMicroChartBarScales;
}

export function handleChartBarSeries(
  width: number,
  series: DtMicroChartBarSeries,
  domains: DtMicroChartDomains,
  config: DtMicroChartConfig,
  stack?: Array<Series<{ [key: string]: number }, string>>
): DtMicroChartBarSeriesData {
  const { x, y } = getScales(width, domains, config);
  const data = series._transformedData;

  const transformedData: DtMicroChartBarSeriesData = {
    scales: { x, y },
    points: [],
  };

  if (stack) {
    const stackData = stack.find((stackedSeries) => stackedSeries.key === series._id);
    if (stackData) {
      transformedData.points = stackData.map((d, index) => {
        const d0 = d[0];
        const d1 = !isNaN(d[1]) ? d[1] : 0;
        return {
          x: x(d0),
          y: y(index) as number,
          width: x(d1 - d0),
          height: y.bandwidth(),
        };
      });
    } else {
      throw new Error(`Stack data was not found for series: ${series._id}`);
    }
  } else {
    transformedData.points = data.map((dp, index) => ({
      x: x(domains.y.min),
      y: y(index) as number,
      width: x(dp[1]) > 0 ? x(dp[1]) : 1,
      height: y.bandwidth(),
    }));
  }
  return transformedData;
}

// export function handleChartBarSeries(width: number, data: DtMicroChartUnifiedInputData, domains: DtMicroChartDomains, config: DtMicroChartConfig): DtMicroChartBarSeriesData {
//   const { x, y } = getScales(width, domains, config);

//   const points: DtMicroChartBarDataPoint[]  = [];
//   const iterator = data.entries();
//   let result = iterator.next();
//   while (!result.done) {
//     const [key, value] = result.value;
//     points.push({
//       x: x(domains.y.min),
//       y: y(key) as number,
//       // TODO: check for null correctly
//       width: x(value!) > 0 ? x(value!) : 1,
//       height: y.bandwidth(),
//     });
//     result = iterator.next();
//   }

//   const transformedData = {
//     points,
//     scales: {
//       x,
//       y,
//     },
//   };
//   return transformedData;
// }

function getScales(width: number, domains: DtMicroChartDomains, config: DtMicroChartConfig): DtMicroChartBarScales {
  const x = scaleLinear()
    .range([0, width - config.marginLeft - config.marginRight])
    .domain([domains.y.min, domains.y.max]);

  const y = scaleBand<number>()
    .range([0, config.height - config.marginTop - config.marginBottom])
    .paddingInner(0.2)
    .domain(new Array(domains.x.numberOfPoints).fill(1).map((_, i) => i));
  return { x, y };
}
