import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { DtLogEntry } from './log-entry';

const LOG_BUS = new Subject<DtLogEntry>();

@Injectable({ providedIn: 'root' })
export class DtLogConsumer {
  consume(): Observable<DtLogEntry> {
    return LOG_BUS.asObservable();
  }

  log(logEntry: DtLogEntry): void {
    LOG_BUS.next(logEntry);
  }
}

export const DT_STATIC_LOG_CONSUMER = new DtLogConsumer();
