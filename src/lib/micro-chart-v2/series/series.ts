import { DtMicroChartConfig } from '../micro-chart-config';
import { DtMicroChartSeries } from '../public-api';

export abstract class DtMicroChartSeriesSVG extends DtMicroChartSeries {
  _config: DtMicroChartConfig;
  abstract _reflow(width: number): void;
}
