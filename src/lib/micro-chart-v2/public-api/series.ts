
export type DtMicroChartSeriesType = 'line' | 'column' | 'bar';

export abstract class DtMicroChartSeries {
  readonly type: DtMicroChartSeriesType;
}
