import { ChartObject } from 'highcharts';

/** Interface for chart tooltip points inside the tooltip */
export interface DtChartTooltipPoint {
  x: number;
  y: number;
  total: number;
  color: string;
  colorIndex: number;
  key: number;
  percentage: number;
  // Unfortunately the types for highcharts are not matching version 6 therefore the types are not assignable here
  // TODO: update highcharts types as soon as the are available
  // tslint:disable-next-line:no-any
  point: any;
  // tslint:disable-next-line:no-any
  series: any;
}

/** Interface for the chart tooltip data */
export interface DtChartTooltipData {
  x: number;
  y: number;
  points?: DtChartTooltipPoint[];
  point?: DtChartTooltipPoint;
}
export interface DtChartTooltipEvent { data: DtChartTooltipData; chart?: ChartObject; }
