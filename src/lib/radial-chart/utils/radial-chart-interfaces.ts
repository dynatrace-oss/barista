export interface DtRadialChartAngleData {
  startAngle: number;
  endAngle: number;
}

export interface SVGPoint {
  x: number;
  y: number;
}

export interface DtRadialChartRenderData {
  name: string;
  path: string;
  color: string;
  value: number;
  ariaLabel: string;
  labelStroke: string;
  labelCoordinates: SVGPoint;
}
