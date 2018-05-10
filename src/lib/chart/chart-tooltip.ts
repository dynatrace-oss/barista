import { DtLogger, DtLoggerFactory } from '../core/index';

const LOG: DtLogger = DtLoggerFactory.create('DtChart');

export function defaultTooltipFormatter(): string | boolean {
  LOG.warn('DefaultTooltipFormatter used - please specify a custom tooltip.formatter');

  return this.series.name;
}
