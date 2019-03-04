import { ScaleLinear, scaleLinear, ScaleBand, scaleBand } from 'd3-scale';
import { DtMicroChartSeriesData, DtMicroChartDomains, DtMicroChartUnifiedInputData } from './chart';
import { DtMicroChartConfig } from '../../micro-chart-config';

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

export function handleChartBarSeries(width: number, data: DtMicroChartUnifiedInputData, domains: DtMicroChartDomains, config: DtMicroChartConfig): DtMicroChartBarSeriesData {
  const { x, y } = getScales(width, domains, config);
  const transformedData = {
    points: data.map((dp, index) => ({
      x: x(domains.y.min),
      y: y(index) as number,
      width: x(dp[1]) > 0 ? x(dp[1]) : 1,
      height: y.bandwidth(),
    })),
    scales: {
      x,
      y,
    },
  };
  return transformedData;
}

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
