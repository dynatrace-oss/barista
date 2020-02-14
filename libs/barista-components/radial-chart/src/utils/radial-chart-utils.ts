/**
 * @license
 * Copyright 2020 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { arc, pie, PieArcDatum } from 'd3-shape';
import { getDtRadialChartInvalidMaxValueError } from '../radial-chart-errors';

/**
 * Returns the sum of all given number values.
 */
export function getSum(values: number[]): number {
  return values.reduce(
    (sum, currentValue) => (currentValue ? sum + currentValue : sum),
    0,
  );
}

/**
 * Returns the end angle of the circle arc based on the given
 * max value and the sum of all chart series values.
 */
export function getEndAngle(maxValue: number, sumValue: number): number {
  if (maxValue <= 0) {
    throw getDtRadialChartInvalidMaxValueError(maxValue);
  }
  if (maxValue < sumValue) {
    return Math.PI * 2;
  }
  return (Math.PI * sumValue * 2) / maxValue;
}

/**
 * Generates the pie arc data using d3 functions.
 * This data is later used by the arc generator
 * to generate the svg path.
 */
export function generatePieArcData(
  seriesValues: number[],
  maxValue: number | null,
): Array<PieArcDatum<number>> {
  const pieGenerator = pie<number>();
  /**
   * If a max value is given, the end angle must be calculated
   * based on the sum of the series' values and the max value.
   */
  if (maxValue) {
    const sumAllValues = getSum(seriesValues);
    pieGenerator.endAngle(() => getEndAngle(maxValue, sumAllValues));
  }
  /**
   * Reset default d3 sorting which sorts data by value (desc)
   * to sort data the way it's ordered in the input array instead.
   */
  pieGenerator.sort(null);
  return pieGenerator(seriesValues);
}

/**
 * Generates the svg path data for one series
 * based on the given values that were generated before.
 */
export function generatePathData(
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
): string | null {
  const arcGenerator = arc();
  return arcGenerator({
    outerRadius,
    innerRadius,
    startAngle,
    endAngle,
  });
}
