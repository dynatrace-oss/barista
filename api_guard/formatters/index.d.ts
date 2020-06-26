export declare function adjustNumber(value: number, abbreviate?: boolean, maxPrecision?: number): string;

export declare class DtBits implements PipeTransform {
    transform(input: any, factor?: number, inputUnit?: DtUnit): DtFormattedValue | string;
}

export declare class DtBytes implements PipeTransform {
    transform(input: any, factor?: number, inputUnit?: DtUnit): DtFormattedValue | string;
}

export declare class DtCount implements PipeTransform {
    transform(input: any, inputUnit?: DtUnit | string): DtFormattedValue | string;
}

export declare class DtDateRange implements PipeTransform {
    constructor(_locale: string);
    transform(value: [number, number]): string;
}

export declare class DtDuration implements PipeTransform {
    transform(duration: any, formatMethod: DurationMode, outputUnit: DtTimeUnit | undefined, inputUnit?: DtTimeUnit): DtFormattedValue | string;
}

export declare function dtFormatDateRange(start: number, end: number, locale?: string): string;

export declare class DtFormattedValue {
    get displayData(): FormattedData;
    get formattedDisplayUnit(): string;
    get sourceData(): SourceData;
    constructor(_sourceData: SourceData, _formattedData: FormattedData);
    toString(): string;
}

export declare class DtFormattersModule {
}

export declare class DtKilobytes implements PipeTransform {
    transform(input: any, factor?: number, inputUnit?: DtUnit): DtFormattedValue | string;
}

export declare class DtMegabytes implements PipeTransform {
    transform(input: any, factor?: number, inputUnit?: DtUnit): DtFormattedValue | string;
}

export interface DtNumberFormatOptions {
    factor: number;
    inputUnit: DtUnit | string;
    outputUnit?: DtUnit | string;
}

export declare class DtPercent implements PipeTransform {
    transform(input: any, maxPrecision?: number): DtFormattedValue | string;
}

export declare class DtRate implements PipeTransform {
    transform(input: any, // tslint:disable-line:no-any
    rateUnit: DtRateUnit | string): DtFormattedValue | string;
}

export declare enum DtRateUnit {
    PER_NANOSECOND = "ns",
    PER_MILLISECOND = "ms",
    PER_SECOND = "s",
    PER_MINUTE = "min",
    PER_HOUR = "h",
    PER_DAY = "d",
    PER_WEEK = "w",
    PER_MONTH = "mo",
    PER_YEAR = "y"
}

export declare enum DtTimeUnit {
    YEAR = "y",
    MONTH = "mo",
    DAY = "d",
    HOUR = "h",
    MINUTE = "min",
    SECOND = "s",
    MILLISECOND = "ms",
    MICROSECOND = "\u00B5s",
    NANOSECOND = "ns"
}

export declare const enum DtUnit {
    PERCENT = "%",
    COUNT = "count",
    BYTES = "B",
    KILO_BYTES = "kB",
    MEGA_BYTES = "MB",
    GIGA_BYTES = "GB",
    TERA_BYTES = "TB",
    PETA_BYTES = "PB",
    BITS = "bit",
    KILO_BITS = "kbit",
    MEGA_BITS = "Mbit",
    GIGA_BITS = "Gbit",
    TERA_BITS = "Tbit",
    PETA_BITS = "Pbit"
}

export declare function formatBits(input: any, options?: DtNumberFormatOptions): DtFormattedValue;

export declare function formatBytes(input: any, // tslint:disable-line:no-any
options?: DtNumberFormatOptions): DtFormattedValue;

export declare function formatCount(input: DtFormattedValue | number, inputUnit?: DtUnit | string): DtFormattedValue;

export declare function formatDuration(duration: number, formatMethod?: DurationMode, outputUnit?: DtTimeUnit, inputUnit?: DtTimeUnit): DtFormattedValue | string;

export declare function formatPercent(input: number, maxPrecision?: number): DtFormattedValue;

export declare function formatRate(input: DtFormattedValue | number, rateUnit: DtRateUnit | string): DtFormattedValue;

export interface FormattedData {
    readonly displayRateUnit?: string;
    readonly displayUnit?: string;
    readonly displayValue?: string;
    readonly displayWhiteSpace?: boolean;
    readonly transformedValue?: number;
}

export declare const KIBI_MULTIPLIER = 1024;

export declare const KILO_MULTIPLIER = 1000;

export interface SourceData {
    readonly input: number;
    readonly unit: DtUnit | string;
}
