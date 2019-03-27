import { ScaleLinear, scaleLinear } from 'd3-scale';
import { DtMicroChartDomains, DtMicroChartExtremes, DtMicroChartDataPoint } from './chart';
import { DtMicroChartConfig } from '../../micro-chart-config';
import { findExtremes, interpolateNullValues } from '../../helper-functions';
import { DtMicroChartLineSeries } from '../../public-api/line';

export interface DtMicroChartLineScales {
  x: ScaleLinear<number, number>;
  y: ScaleLinear<number, number>;
}

// tslint:disable-next-line: no-empty-interface
export interface DtMicroChartLineDataPoint extends DtMicroChartDataPoint {}

export interface DtMicroChartLineSeriesData {
  points: DtMicroChartLineDataPoint[];
  scales: DtMicroChartLineScales;
  extremes: DtMicroChartExtremes<DtMicroChartLineDataPoint>;
}

export function handleChartLineSeries(
  width: number,
  series: DtMicroChartLineSeries,
  domains: DtMicroChartDomains,
  config: DtMicroChartConfig
): DtMicroChartLineSeriesData {
  const { x, y } = getScales(width, domains, config);
  let data = series._transformedData;

  // interpolate null values
  if (!series.skipNullValues) {
    data = interpolateNullValues(data);
  }
  const { min, max } = findExtremes<DtMicroChartLineDataPoint>(data, (d) => d.y);

  const points = data.map((dp) => ({
    x: x(dp.x),
    y: dp.y === null ? null : y(dp.y),
    interpolated: dp.interpolated,
  }));

  const transformedData = {
    points,
    scales: {
      x,
      y,
    },
    extremes: {
      min: { x: x(min.x), y: y(min.y!) },
      minAnchor: { x: x(min.x), y: y(min.y!) },
      minValue: min.y,
      max: { x: x(max.x), y: y(max.y!) },
      maxAnchor: { x: x(max.x), y: y(max.y!) },
      maxValue: max.y,
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
