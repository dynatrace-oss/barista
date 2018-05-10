import { DtLogger } from './logger';
import { DT_STATIC_LOG_CONSUMER } from './log-consumer';

// tslint:disable:no-unnecessary-class
export class DtLoggerFactory {
  static create(name: string): DtLogger {
    return new DtLogger(name, DT_STATIC_LOG_CONSUMER);
  }
}
