import { ScaleLinear, scaleLinear, ScaleBand, scaleBand } from 'd3-scale';
import { DtMicroChartSeriesData, DtMicroChartDomains, DtMicroChartUnifiedInputData, DtMicroChartExtremes } from './chart';
import { DtMicroChartConfig } from '../../micro-chart-config';
import { findExtremes } from '../../helper-functions';

export interface DtMicroChartColumnScales {
  x: ScaleBand<string>;
  y: ScaleLinear<number, number>;
}

export interface DtMicroChartColumnDataPoint {
  x: number | null;
  y: number | null;
  width: number;
  height: number;
}

export interface DtMicroChartColumnSeriesData extends DtMicroChartSeriesData {
  points: DtMicroChartColumnDataPoint[];
  scales: DtMicroChartColumnScales;
  extremes: DtMicroChartExtremes<DtMicroChartColumnDataPoint>;
}

/** Helper function to calculate a datapoint based on scales and domains. */
function calculatePoint(index: number,  dataPoint: number | null, domains: DtMicroChartDomains, scales: DtMicroChartColumnScales): DtMicroChartColumnDataPoint {
  // Bandwidth x is a unique string identifier.
  const x = scales.x(index.toString()) as number;
  // If the y resulting y value is 0, move the indicator up by one to accomodate for minimum height of 1.
  const y = (scales.y(domains.y.min) - scales.y(dataPoint)) > 0 ?
    scales.y(dataPoint) :
    scales.y(dataPoint) - 1;
  const width = scales.x.bandwidth();
  // Fall back to a minimum height of 1.
  const height =  (scales.y(domains.y.min) - scales.y(dataPoint)) > 0 ?
    scales.y(domains.y.min) - scales.y(dataPoint) :
    1;

  return { x, y, height, width, };
}

export function handleChartColumnSeries(width: number, data: DtMicroChartUnifiedInputData, domains: DtMicroChartDomains, config: DtMicroChartConfig): DtMicroChartColumnSeriesData {
  const scales = getScales(width, domains, config);
  // Calculate Min and Max values
  const { min, minIndex, max, maxIndex } = findExtremes<Array<number|null>>(data, (d) => d[1]);
  const minPoint = calculatePoint(minIndex, min[1], domains, scales);
  const maxPoint = calculatePoint(maxIndex, max[1], domains, scales);

  const transformedData = {
    points: data.map((dp, index) => calculatePoint(index, dp[1], domains, scales)),
    scales,
    extremes: {
      min: minPoint,
      minAnchor: {
        x: minPoint.x! + (minPoint.width / 2),
        y: minPoint.y! + minPoint.height,
      },
      minValue: min[1],
      max: maxPoint,
      maxAnchor: {
        x: maxPoint!.x! + (maxPoint.width / 2),
        y: maxPoint.y as number,
      },
      maxValue: max[1],
    },
  };
  return transformedData;
}

function getScales(width: number, domains: DtMicroChartDomains, config: DtMicroChartConfig): DtMicroChartColumnScales {
  const x = scaleBand<number>()
    .range([0, width - config.marginLeft - config.marginRight])
    .paddingInner(0.5)
    .domain(new Array(domains.x.numberOfPoints).fill(1).map((_, i) => i));
  const y = scaleLinear()
    .range([config.height - config.marginTop - config.marginBottom, 0])
    .domain([domains.y.min, domains.y.max]);
  return { x, y };
}
