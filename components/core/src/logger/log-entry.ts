import { DtLogLevel } from './log-level.enum';

// tslint:disable-next-line:no-any (Log-appender should handle type recognition)
export type DtLogEntryParam = any;

export interface DtLogEntry {
  loggerName: string;
  message: string;
  level: DtLogLevel;
  param?: DtLogEntryParam;
  stack?: string;
}
