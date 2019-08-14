import { stack as d3Stack, Series } from 'd3-shape';
import { DtMicroChartDomains } from './chart';
import { max } from 'd3-array';
import {
  DtMicroChartSeries,
  DtMicroChartStackableSeries,
} from '../../public-api/series';

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
 * after creating this map we pass that to the stack function of d3
 */
export function createStack(
  series: DtMicroChartSeries[],
): Array<Series<{ [key: string]: number }, string>> {
  // Map that holds a map for each stackContainer containing the summed values for a key (xAxis)
  const stackMap = new Map<string, { [key: string]: number }>();

  const stackedSeries = series.filter(
    s => s instanceof DtMicroChartStackableSeries && s.isStacked,
  );

  stackedSeries.forEach(s => {
    for (const dp of s._transformedData) {
      const stackedDataMap: { [key: string]: number } = stackMap.has(
        dp.x.toString(),
      )
        ? stackMap.get(dp.x.toString())!
        : {};
      // Fall back to 0 value if the dataPoint is null.
      stackedDataMap[s._id] = dp.y || 0;
      stackMap.set(dp.x.toString(), stackedDataMap);
    }
  });

  return d3Stack().keys(Array.from(stackedSeries.map(s => s._id)))(
    Array.from(stackMap.values()),
  );
}

export function extendDomainForStack(
  domains: DtMicroChartDomains,
  stack: Array<Series<{ [key: string]: number }, string>>,
): DtMicroChartDomains {
  if (!stack.length) {
    return domains;
  }
  const stackMax = max(stack, y => max(y, d => d[1]));
  return {
    ...domains,
    y: {
      ...domains.y,
      max:
        stackMax !== undefined && stackMax > domains.y.max
          ? stackMax
          : domains.y.max,
      min: 0,
    },
  };
}
