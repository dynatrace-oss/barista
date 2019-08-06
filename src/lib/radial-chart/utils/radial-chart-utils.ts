// tslint:disable: no-magic-numbers
import { arc, pie, PieArcDatum } from 'd3-shape';
import { SVGPoint } from './radial-chart-interfaces';

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
    // TODO: ? throw error: max value must be greater or equal than the sum of all series values
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

export function getCentroid(
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
): [number, number] {
  const arcGenerator = arc();
  return arcGenerator.centroid({
    outerRadius,
    innerRadius,
    startAngle,
    endAngle,
  });
}

/**
 * Get SVG points that define the label stroke,
 * based on the given centroid of the arc.
 */
export function getLabelStrokePoints(
  centroid: [number, number],
  radius: number,
  length: number,
): SVGPoint[] {
  const vectorLength = Math.sqrt(
    Math.pow(centroid[0], 2) + Math.pow(centroid[1], 2),
  );
  const normalizedCentroid: SVGPoint = {
    x: centroid[0] / vectorLength,
    y: centroid[1] / vectorLength,
  };

  const lengthVector: SVGPoint = {
    x: normalizedCentroid.x * length,
    y: normalizedCentroid.y * length,
  };

  const start = {
    x: normalizedCentroid.x * radius,
    y: normalizedCentroid.y * radius,
  };
  const angle = {
    x: start.x + lengthVector.x,
    y: start.y + lengthVector.y,
  };
  const end = {
    x: angle.x + lengthVector.x,
    y: angle.y,
  };
  return [start, angle, end];
}

/**
 * Generates an svg path starting from the first given point,
 * drawing lines from one point to the next one.
 * See https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#Line_commands
 * for details.
 */
export function generateStrokePath(points: SVGPoint[]): string {
  return points.reduce((pathString, currentPoint, index, array) => {
    const modifier = index === array.length - 1 ? '' : 'L';
    return `${pathString}${currentPoint.x},${currentPoint.y}${modifier}`;
  }, 'M');
}

/**
 * Adjust coordinates of label stroke end point to
 * calculate the text position.
 */
export function getLabelTextPosition(end: SVGPoint): SVGPoint {
  return {
    x: end.x < 0 ? end.x - 10 : end.x + 10,
    y: end.y + 5,
  };
}

// tslint:enable: no-magic-numbers
