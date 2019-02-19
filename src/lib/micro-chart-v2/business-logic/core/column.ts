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
    points: series.data.map((dp, index) => ({
      x: x(index.toString()) as number,
      y: y(dp),
      height: y(0) - y(dp),
      width: x.bandwidth(),
    })),
    scales: {
      x,
      y,
    },
  };
  console.log(transformedData);
  return transformedData;
}

function getScales(width: number, domains: DtMicroChartDomains, config: DtMicroChartConfig): { x: ScaleBand<string>; y: ScaleLinear<number, number> } {
  const x =  scaleBand<string>().range([0, width - config.marginLeft - config.marginRight]);
  console.log(domains.x.map((v) => v.toString()));
  // x.domain(domains.x.map((v) => v.toString()));
  x.domain(new Array(4).fill(''));

  const y = scaleLinear().range([config.height - config.marginTop - config.marginBottom, 0]);
  y.domain(domains.y);
  return { x, y };
}
