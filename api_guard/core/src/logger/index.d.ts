export declare const DT_LOGGER_NAME: InjectionToken<string>;

export declare const DT_STATIC_LOG_CONSUMER: DtLogConsumer;

export declare class DtLogConsumer {
  consume(): Observable<DtLogEntry>;
  log(logEntry: DtLogEntry): void;
}

export interface DtLogEntry {
  level: DtLogLevel;
  loggerName: string;
  message: string;
  param?: DtLogEntryParam;
  stack?: string;
}

export declare type DtLogEntryParam = any;

export declare class DtLogger {
  readonly name: string;
  constructor(name: string, _consumer: DtLogConsumer);
  debug(message: string, param?: DtLogEntryParam): void;
  error(message: string, param?: DtLogEntryParam): void;
  info(message: string, param?: DtLogEntryParam): void;
  warn(message: string, param?: DtLogEntryParam): void;
}

export declare class DtLoggerFactory {
  static create(name: string): DtLogger;
}

export declare enum DtLogLevel {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}
