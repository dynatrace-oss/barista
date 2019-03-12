import {
  DtMicroChartStackableSeries,
  DtMicroChartSeries
} from '../../public-api';
import { stack as d3Stack, Series } from 'd3-shape';
import { DtMicroChartDomains } from './chart';
import { max } from 'd3-array';

/**
 * Create stack
 * returns a map with the stacked information for each series with the series uniqueId as the key
 * input for this method are series that hold unified data in the form of
 * series0 = [[0, 10], [2, 10]]
 * series1 = [[0, 20], [1, 20], [2, 20]]
 * ....
 * since both series might not have the same values for x0, x1, etc we need to check and fill out not overlapping entries with null
 * so we first loop over all series and convert to a map that looks as follows if the x values are the same for each series
 *
 * Map {
 *  0: Map {
 *          series0: 10,
 *          series1: 20
 *       },
 * 1: Map {
 *          series1: 20
 *       }
 * 2: Map {
 *          series0: 10,
 *          series1: 20
 *       },
 * }
 *
 * after creating this map we then loop over all keys and all series and try to get the y value for the key for the series.
 * e.g. get y value for series0 for x=0 --> 10
 * if we don't get a value we fallback to null
 * so we can create an array for each series like [10, null, 10] for series0 and [20, 20, 20] for series1
 * and we pass that to the stack function of d3
 */
export function createStack(
  series: DtMicroChartSeries[]
): Array<Series<{ [key: string]: number }, string>> {
  // Map that holds a map for each stackContainer containing the summed values for a key (xAxis)
  const stackMap = new Map<string, { [key: string]: number }>();

  const stackedSeries = series.filter(
    (s) =>
      s instanceof DtMicroChartStackableSeries &&
      s.isStacked &&
      !s._stackedContainer.disabled
  );

  stackedSeries.forEach((s) => {
    for (const dp of s._transformedData) {
      const stackedDataMap: { [key: string]: number } = stackMap.has(
        dp[0].toString()
      )
        ? stackMap.get(dp[0].toString())!
        : {};
      stackMap.set(dp[0].toString(), stackedDataMap);
      stackedDataMap[s._id] = dp[1];
    }
  });

  return d3Stack().keys(Array.from(stackedSeries.map((s) => s._id)))(Array.from(stackMap.values()));
}

export function extendDomainForStack(
  domains: DtMicroChartDomains,
  stack: Array<Series<{ [key: string]: number }, string>>
): DtMicroChartDomains {
  const stackMax = max(stack, (y) => max(y, (d) => d[1]));
  return { ...domains, y: { ...domains.y, max: stackMax ? stackMax : domains.y.max }};
}
