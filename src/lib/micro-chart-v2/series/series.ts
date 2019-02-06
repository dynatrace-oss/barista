import { DtMicroChartConfig } from '../micro-chart-config';
import { DtMicroChartSeries } from '../public-api';

export abstract class DtMicroChartSeriesInternal extends DtMicroChartSeries {
  _config: DtMicroChartConfig;
  abstract _reflow(width: number): void;
}
