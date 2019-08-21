import { Inject, Injectable, InjectionToken } from '@angular/core';

import { DtLogConsumer } from './log-consumer';
import { DtLogEntryParam } from './log-entry';
import { DtLogLevel } from './log-level.enum';

export const DT_LOGGER_NAME = new InjectionToken<string>('DtLoggerName');

@Injectable()
export class DtLogger {
  constructor(
    @Inject(DT_LOGGER_NAME) readonly name: string,
    private readonly _consumer: DtLogConsumer,
  ) {}

  error(message: string, param?: DtLogEntryParam): void {
    this._log(DtLogLevel.ERROR, message, param);
  }

  warn(message: string, param?: DtLogEntryParam): void {
    this._log(DtLogLevel.WARNING, message, param);
  }

  info(message: string, param?: DtLogEntryParam): void {
    this._log(DtLogLevel.INFO, message, param);
  }

  debug(message: string, param?: DtLogEntryParam): void {
    this._log(DtLogLevel.DEBUG, message, param);
  }

  private _log(level: DtLogLevel, message: string, param?: Error): void {
    this._consumer.log({
      loggerName: this.name,
      level,
      message,
      param,
    });
  }
}
