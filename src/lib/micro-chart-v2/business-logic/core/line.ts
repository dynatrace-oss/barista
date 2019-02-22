import { ScaleLinear, scaleLinear } from 'd3-scale';
import { DtMicroChartLineSeries } from '../../public-api';
import { DtMicroChartSeriesData, DtMicroChartDomains } from './chart';
import { DtMicroChartConfig } from '../../micro-chart-config';

export interface DtMicroChartLineSeriesData extends DtMicroChartSeriesData {
  points: { x: number; y: number }[];
  scales: {
    x: ScaleLinear<number, number>;
    y: ScaleLinear<number, number>;
  };
}

export function handleChartLineSeries(width: number, series: DtMicroChartLineSeries, domains: DtMicroChartDomains, config: DtMicroChartConfig): DtMicroChartLineSeriesData {
  const { x, y } = getScales(width, domains, config);
  const transformedData = {
    type: series.type,
    points: series._transformedData.map((dp) => ({ x: x(dp[0]), y: y(dp[1]) })),
    scales: {
      x,
      y,
    },
  };
  return transformedData;
}

function getScales(width: number, domains: DtMicroChartDomains, config: DtMicroChartConfig): { x: ScaleLinear<number, number>; y: ScaleLinear<number, number> } {
  const x =  scaleLinear().range([0, width - config.marginLeft - config.marginRight]);
  x.domain([domains.x.min, domains.x.max]);

  const y = scaleLinear().range([config.height - config.marginTop - config.marginBottom, 0]);
  y.domain([domains.y.min, domains.y.max]);
  return { x, y };
}
