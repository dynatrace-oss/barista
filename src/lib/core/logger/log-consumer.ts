import { Subject, Observable } from 'rxjs';
import { Provider } from '@angular/core';
import { DtLogEntry } from './log-entry';

export abstract class DtLogConsumer {
  abstract consume(): Observable<DtLogEntry>;
  abstract log(logEntry: DtLogEntry): void;
}

const LOG_BUS = new Subject<DtLogEntry>();

export const DT_STATIC_LOG_CONSUMER: DtLogConsumer = {
  consume(): Observable<DtLogEntry> {
    return LOG_BUS.asObservable();
  },

  log(logEntry: DtLogEntry): void {
    LOG_BUS.next(logEntry);
  },
};

// Angular integration
export const DT_LOG_CONSUMER_PROVIDER: Provider = {
  provide: DtLogConsumer,
  useValue: DT_STATIC_LOG_CONSUMER,
};
