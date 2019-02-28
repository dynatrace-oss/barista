import { ScaleLinear, scaleLinear, ScaleBand, scaleBand } from 'd3-scale';
import { DtMicroChartSeriesData, DtMicroChartDomains, DtMicroChartUnifiedInputData } from './chart';
import { DtMicroChartConfig } from '../../micro-chart-config';

export interface DtMicroChartColumnScales {
  x: ScaleBand<string>;
  y: ScaleLinear<number, number>;
}
export interface DtMicroChartColumnSeriesData extends DtMicroChartSeriesData {
  points: Array<{ x: number; y: number; width: number; height: number }>;
  scales: DtMicroChartColumnScales;
}

export function handleChartColumnSeries(width: number, data: DtMicroChartUnifiedInputData, domains: DtMicroChartDomains, config: DtMicroChartConfig): DtMicroChartColumnSeriesData {
  const { x, y } = getScales(width, domains, config);
  const transformedData = {
    points: data.map((dp, index) => ({
      x: x(index.toString()) as number,
      y: (y(domains.y.min) - y(dp[1])) > 0 ? y(dp[1]) : y(dp[1]) - 1,
      height: (y(domains.y.min) - y(dp[1])) > 0 ? y(domains.y.min) - y(dp[1]) : 1,
      width: x.bandwidth(),
    })),
    scales: {
      x,
      y,
    },
  };
  return transformedData;
}

function getScales(width: number, domains: DtMicroChartDomains, config: DtMicroChartConfig): DtMicroChartColumnScales {
  const x = scaleBand<number>()
    .range([0, width - config.marginLeft - config.marginRight])
    .paddingInner(0.2)
    .domain(new Array(domains.x.numberOfPoints).fill(1).map((_, i) => i));
  const y = scaleLinear()
    .range([config.height - config.marginTop - config.marginBottom, 0])
    .domain([domains.y.min, domains.y.max]);
  return { x, y };
}
