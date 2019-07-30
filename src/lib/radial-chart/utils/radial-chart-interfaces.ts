export type DtRadialChartType = 'pie' | 'donut';

export interface DtRadialChartAngleData {
  startAngle: number;
  endAngle: number;
}

export interface DtRadialChartRenderData {
  name: string;
  path: string;
  color: string;
  value: number;
  angleData?: DtRadialChartAngleData;
}
