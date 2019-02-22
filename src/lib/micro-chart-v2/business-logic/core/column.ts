import { ScaleLinear, scaleLinear, ScaleBand, scaleBand } from 'd3-scale';
import { DtMicroChartColumnSeries } from '../../public-api';
import { DtMicroChartSeriesData, DtMicroChartDomains } from './chart';
import { DtMicroChartConfig } from '../../micro-chart-config';

export interface DtMicroChartColumnSeriesData extends DtMicroChartSeriesData {
  points: { x: number; y: number; width: number; height: number; }[];
  scales: {
    x: ScaleBand<string>;
    y: ScaleLinear<number, number>;
  };
}

export function handleChartColumnSeries(width: number, series: DtMicroChartColumnSeries, domains: DtMicroChartDomains, config: DtMicroChartConfig): DtMicroChartColumnSeriesData {
  const { x, y } = getScales(width, domains, config);
  const transformedData = {
    type: series.type,
    points: series._transformedData.map((dp, index) => ({
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

function getScales(width: number, domains: DtMicroChartDomains, config: DtMicroChartConfig): { x: ScaleBand<number>; y: ScaleLinear<number, number> } {
  const x = scaleBand<number>().range([0, width - config.marginLeft - config.marginRight]);
  // map for distinct x values.
  x.paddingInner(0.2)
  x.domain(new Array(domains.x.numberOfPoints).fill(1).map((_, i) => i));
  const y = scaleLinear().range([config.height - config.marginTop - config.marginBottom, 0]);
  y.domain([domains.y.min, domains.y.max]);
  return { x, y };
}
