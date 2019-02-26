import { ScaleLinear, scaleLinear } from 'd3-scale';
import { DtMicroChartLineSeries } from '../../public-api';
import { DtMicroChartSeriesData, DtMicroChartDomains, DtMicroChartUnifiedInputData } from './chart';
import { DtMicroChartConfig } from '../../micro-chart-config';

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
  extremes: {
    min: DtMicroChartLineDataPoint;
    max: DtMicroChartLineDataPoint;
  };
}

export function handleChartLineSeries(width: number, data: DtMicroChartUnifiedInputData, domains: DtMicroChartDomains, config: DtMicroChartConfig): DtMicroChartLineSeriesData {
  const { x, y } = getScales(width, domains, config);
  const points: DtMicroChartLineDataPoint[] = [];
  let min: DtMicroChartLineDataPoint = Infinity;
  let max: DtMicroChartLineDataPoint = -Infinity;

  for (const dataPoint of data) {
    if (dataPoint) {
      if (dataPoint && dataPoint[1] !== null && dataPoint[1]! < min.y) {
        min = { x: dataPoint[0], y: dataPoint[1] };
      }
    }
    points.push({ x: x(dataPoint[0]), y: y(dataPoint[1]) });
  }
  min = {
    x: x(min.x),
    y: y(min.y),
  }
  const transformedData = {
    points,
    scales: {
      x,
      y,
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
