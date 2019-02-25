import { ScaleLinear, scaleLinear, ScaleBand, scaleBand } from 'd3-scale';
import { DtMicroChartBarSeries } from '../../public-api';
import { DtMicroChartSeriesData, DtMicroChartDomains } from './chart';
import { DtMicroChartConfig } from '../../micro-chart-config';

export interface DtMicroChartBarSeriesData extends DtMicroChartSeriesData {
  points: Array<{ x: number; y: number; width: number; height: number}>;
  scales: {
    x: ScaleLinear<number, number>;
    y: ScaleBand<string>;
  };
}

export function handleChartBarSeries(width: number, series: DtMicroChartBarSeries, domains: DtMicroChartDomains, config: DtMicroChartConfig): DtMicroChartBarSeriesData {
  const { x, y } = getScales(width, domains, config);
  const transformedData = {
    type: series.type,
    points: series._transformedData.map((dp, index) => ({
      x: x(domains.y.min),
      y: y(index.toString()) as number,
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

function getScales(width: number, domains: DtMicroChartDomains, config: DtMicroChartConfig): { x: ScaleBand<number>; y: ScaleLinear<number, number> } {
  const x = scaleLinear().range([0, width - config.marginLeft - config.marginRight]);
  x.domain([domains.y.min, domains.y.max]);

  const y = scaleBand<number>().range([0, config.height - config.marginTop - config.marginBottom]);
  // map for distinct x values.
  y.paddingInner(0.2)
  y.domain(new Array(domains.x.numberOfPoints).fill(1).map((_, i) => i));
  return { x, y };
}
