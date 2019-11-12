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

  /** Logs an error to the log consumer. */
  error(message: string, param?: DtLogEntryParam): void {
    this._log(DtLogLevel.ERROR, message, param);
  }

  /** Logs a warning to the log consumer. */
  warn(message: string, param?: DtLogEntryParam): void {
    this._log(DtLogLevel.WARNING, message, param);
  }

  /** Logs an info message to the log consumer. */
  info(message: string, param?: DtLogEntryParam): void {
    this._log(DtLogLevel.INFO, message, param);
  }

  /** Logs a debug message to the log consumer. */
  debug(message: string, param?: DtLogEntryParam): void {
    this._log(DtLogLevel.DEBUG, message, param);
  }

  private _log(level: DtLogLevel, message: string, param?: Error): void {
    const stack = new Error().stack;

    this._consumer.log({
      loggerName: this.name,
      level,
      message,
      param,
      stack,
    });
  }
}
