import { DtLogger } from './logger';
import { DtStaticLogConsumer } from './log-consumer';

// tslint:disable:no-unnecessary-class
export class DtLoggerFactory {
  static create(name: string): DtLogger {
    return new DtLogger(name, DtStaticLogConsumer.getInstance());
  }
}
