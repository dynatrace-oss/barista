import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Provider } from '@angular/core';
import { DtLogEntry } from './log-entry';

export abstract class DtLogConsumer {
  abstract consume(): Observable<DtLogEntry>;
  abstract log(logEntry: DtLogEntry): void;
}

const LOG_BUS = new Subject<DtLogEntry>();

export class DtStaticLogConsumer implements DtLogConsumer {
  private static _instance: DtLogConsumer = new DtStaticLogConsumer();

  private constructor() {}

  static getInstance(): DtLogConsumer {
    return DtStaticLogConsumer._instance;
  }

  consume(): Observable<DtLogEntry> {
    return LOG_BUS.asObservable();
  }

  log(logEntry: DtLogEntry): void {
    LOG_BUS.next(logEntry);
  }
}

export const DT_LOG_CONSUMER_PROVIDER: Provider = {
  provide: DtLogConsumer,
  useValue: DtStaticLogConsumer.getInstance(),
};
