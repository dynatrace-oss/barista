import { DtLogger } from './logger';
import { DtStaticLogConsumer } from './log-consumer';

export class DtLoggerFactory {
  static create(name: string): DtLogger {
    return new DtLogger(name, DtStaticLogConsumer.getInstance());
  }
}
