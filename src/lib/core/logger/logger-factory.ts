import { DT_STATIC_LOG_CONSUMER } from './log-consumer';
import { DtLogger } from './logger';

// tslint:disable:no-unnecessary-class
export class DtLoggerFactory {
  /** Creates a new logger for the provided namespace. */
  static create(name: string): DtLogger {
    return new DtLogger(name, DT_STATIC_LOG_CONSUMER);
  }
}
