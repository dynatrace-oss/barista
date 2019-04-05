import { DtLogger, DtLoggerFactory } from '@dynatrace/angular-components/core';

const logger: DtLogger = DtLoggerFactory.create('DtChart');

// tslint:disable-next-line: no-any
declare var require: any;
// tslint:disable-next-line: no-require-imports no-var-requires
const highcharts = require('highcharts');

export function applyHighchartsErrorHandler(): void {
  // tslint:disable-next-line:no-any
  highcharts.error = function(code: number, stop: boolean): void {
    const message = `HighCharts Error: www.highcharts.com/errors/${code}`;
    logger.error(message);
    if (stop) {
      throw new Error(message);
    }
  };
}
