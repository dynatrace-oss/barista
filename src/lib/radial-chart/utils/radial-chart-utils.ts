// tslint:disable: no-magic-numbers
import { arc, pie, PieArcDatum } from 'd3-shape';

export function getSum(values: number[]): number {
  return values.reduce(
    (sum, currentValue) => (currentValue ? sum + currentValue : sum),
    0,
  );
}

export function getEndAngle(maxValue: number, sumValue: number): number {
  if (maxValue <= 0) {
    // TODO: ? throw error: max value must be greater than 0
  }
  if (maxValue < sumValue) {
    // tslint:disable-next-line:no-magic-numbers
    return Math.PI * 2;
  }
  // tslint:disable-next-line:no-magic-numbers
  return (Math.PI * sumValue * 2) / maxValue;
}

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
  // TODO: if a start value is set adjust the startAngle too
  return pieGenerator(seriesValues);
}

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

// tslint:enable: no-magic-numbers
