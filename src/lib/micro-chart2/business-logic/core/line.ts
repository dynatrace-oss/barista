import { ScaleLinear, scaleLinear } from 'd3-scale';
import { DtMicroChartDomains, DtMicroChartUnifiedInputData, DtMicroChartExtremes } from './chart';
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

export interface DtMicroChartLineSeriesData {
  points: DtMicroChartLineDataPoint[];
  scales: DtMicroChartLineScales;
  extremes: DtMicroChartExtremes<DtMicroChartLineDataPoint>;
}

export function handleChartLineSeries(
  width: number,
  data: DtMicroChartUnifiedInputData,
  domains: DtMicroChartDomains,
  config: DtMicroChartConfig
): DtMicroChartLineSeriesData {
  const { x, y } = getScales(width, domains, config);
  const { min, max } = findExtremes<Array<number | null>>(data, (d) => d[1]);
  const transformedData = {
    points: data.map((dp) => ({ x: x(dp[0]), y: y(dp[1]) })),
    scales: {
      x,
      y,
    },
    extremes: {
      min: { x: x(min[0]), y: y(min[1]) },
      minAnchor: { x: x(min[0]), y: y(min[1]) },
      minValue: min[1],
      max: { x: x(max[0]), y: y(max[1]) },
      maxAnchor: { x: x(max[0]), y: y(max[1]) },
      maxValue: max[1],
    },
  };
  return transformedData;
}

function getScales(width: number, domains: DtMicroChartDomains, config: DtMicroChartConfig): DtMicroChartLineScales {
  const x = scaleLinear()
    .range([0, width - config.marginLeft - config.marginRight])
    .domain([domains.x.min, domains.x.max]);

  const y = scaleLinear()
    .range([config.height - config.marginTop - config.marginBottom, 0])
    .domain([domains.y.min, domains.y.max]);
  return { x, y };
}
