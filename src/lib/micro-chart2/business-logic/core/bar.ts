import { ScaleLinear, scaleLinear, ScaleBand, scaleBand } from 'd3-scale';
import { DtMicroChartDomains, DtMicroChartDataPoint } from './chart';
import { DtMicroChartConfig } from '../../micro-chart-config';
import { Series } from 'd3-shape';
import { DtMicroChartBarSeries } from '../../public-api/bar';
import { interpolateNullValues } from '../../helper-functions';

export interface DtMicroChartBarScales {
  x: ScaleLinear<number, number>;
  y: ScaleBand<number>;
}

export interface DtMicroChartBarDataPoint extends DtMicroChartDataPoint {
  width: number;
  height: number;
}

export interface DtMicroChartBarSeriesData {
  points: DtMicroChartBarDataPoint[];
  scales: DtMicroChartBarScales;
}

function calculatePoint(
  index: number,
  dp: number | null,
  domains: DtMicroChartDomains,
  scales: DtMicroChartBarScales,
  dpStacked?: number
): DtMicroChartBarDataPoint {
  const y = scales.y(index) as number;
  const height = scales.y.bandwidth();
  let x;
  let width;

  if (dp === null) {
    x = null;
  } else {
    if (dpStacked === undefined) {
      // If the y resulting x value is 0, move the indicator up by one to accomodate for minimum width of 1.
      x = scales.x(domains.y.min);
      // Fall back to a minimum width of 1.
      width = scales.x(dp) > 0 ? scales.x(dp) : 1;
    } else {
      x = scales.x(dp);
      width = scales.x(dpStacked - dp);
    }
  }
  return { x, y, height, width };
}

export function handleChartBarSeries(
  width: number,
  series: DtMicroChartBarSeries,
  domains: DtMicroChartDomains,
  config: DtMicroChartConfig,
  stack?: Array<Series<{ [key: string]: number }, string>>
): DtMicroChartBarSeriesData {
  const scales = getScales(width, domains, config);
  let data = series._transformedData;

  const transformedData: DtMicroChartBarSeriesData = {
    scales,
    points: [],
  };

  if (stack) {
    const stackData = stack.find(
      stackedSeries => stackedSeries.key === series._id
    );
    if (stackData) {
      transformedData.points = stackData.map((d, index) => {
        const d0 = d[0];
        // we need this isNaN check because if you have one series with a datapoint for the first x value and another without
        // the stacked value for the one without will be NaN
        const d1 = !isNaN(d[1]) ? d[1] : 0;
        return calculatePoint(index, d0, domains, scales, d1);
      });
    } else {
      throw new Error(`Stack data was not found for series: ${series._id}`);
    }
  } else {
    // interpolate null values
    if (!series.skipNullValues) {
      data = interpolateNullValues(data);
    }
    transformedData.points = data.map((dp, index) => ({
      ...calculatePoint(index, dp.y, domains, scales),
      interpolated: dp.interpolated,
    }));
  }
  return transformedData;
}

function getScales(
  width: number,
  domains: DtMicroChartDomains,
  config: DtMicroChartConfig
): DtMicroChartBarScales {
  const x = scaleLinear()
    .range([0, width - config.marginLeft - config.marginRight])
    .domain([domains.y.min, domains.y.max]);

  const y = scaleBand<number>()
    .range([0, config.height - config.marginTop - config.marginBottom])
    // tslint:disable-next-line:no-magic-numbers
    .paddingInner(0.2)
    .domain(new Array(domains.x.numberOfPoints).fill(1).map((_, i) => i));
  return { x, y };
}
