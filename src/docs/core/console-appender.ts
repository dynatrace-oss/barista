import { DtLogConsumer, DtLogEntry, DtLogEntryParam, DtLogLevel } from '@dynatrace/angular-components';
import { APP_INITIALIZER, FactoryProvider, Injectable } from '@angular/core';

@Injectable()
export class ConsoleAppender {
  constructor(private readonly logConsumer: DtLogConsumer) {
  }

  init(): void {
    this.logConsumer.consume()
      .subscribe((log: DtLogEntry): void => {
        const formattedMessage = `[${log.level}] ${log.loggerName} | ${log.message}`;

        this._log(log.level, formattedMessage);
        if (log.param) {
          this._log(log.level, log.param);
        }
      });
  }

  // tslint:disable:no-console
  private _log(level: DtLogLevel, message: string | DtLogEntryParam): void {
    switch (level) {
      case DtLogLevel.ERROR: console.error(message); break;
      case DtLogLevel.WARN: console.warn(message); break;
      case DtLogLevel.INFO: console.info(message); break;
      case DtLogLevel.DEBUG: console.log(message); break;
      default: console.log(message);
    }
  }
}

export const LOG_APPENDER_PROVIDER: FactoryProvider = {
  deps: [ConsoleAppender],
  multi: true,
  provide: APP_INITIALIZER,
  useFactory: (consoleAppender: ConsoleAppender): () => void => (): void => {
    consoleAppender.init();
  },
};
