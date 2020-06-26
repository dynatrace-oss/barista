export declare function _addCssClass(el: any, name: string): void;

export declare function _getElementBoundingClientRect(
  el: Element | ElementRef,
): ClientRect & {
  isNativeRect: boolean;
};

export declare function _hasCssClass(el: any, name: string): boolean;

export declare function _isValidColorHexValue(value: string): boolean;

export declare function _parseCssValue(
  input: any,
): {
  value: number;
  unit: string;
} | null;

export declare function _readKeyCode(event: KeyboardEvent): number;

export declare function _removeCssClass(
  el: any, // tslint:disable-line:no-any
  name: string,
): void;

export declare function _replaceCssClass(
  elOrRef: any, // tslint:disable-line:no-any
  oldClass: string | null,
  newClass: string | null,
): void;

export declare function _toggleCssClass(
  condition: boolean,
  el: any,
  name: string,
): void;

export declare function clamp(v: number, min?: number, max?: number): number;

export declare function compareNumbers(
  valueA: number | null,
  valueB: number | null,
  direction?: DtSortDirection,
): number;

export declare function compareStrings(
  valueA: string | null,
  valueB: string | null,
  direction?: DtSortDirection,
): number;

export declare function compareValues(
  valueA: string | number | null,
  valueB: string | number | null,
  direction: DtSortDirection,
): number;

export declare type DtSortDirection = 'asc' | 'desc' | '';

export declare function isDefined<T>(value: T): value is NonNullable<T>;

export declare function isEmpty(value: any): value is null | undefined | '';

export declare function isNumber(value: any): value is number;

export declare function isNumberLike(value: any): boolean;

export declare function isObject(
  value: any,
): value is {
  [key: string]: any;
};

export declare function isString(value: any): value is string;

export declare function roundToDecimal(
  toRound: number,
  decimals?: number,
): number;

export declare function runInsideZone(
  ngZone: NgZone,
  scheduler?: SchedulerLike,
): SchedulerLike;

export declare function runOutsideZone(
  ngZone: NgZone,
  scheduler?: SchedulerLike,
): SchedulerLike;

export declare function sanitizeSvg(svgString: string): SVGElement;

export declare function stringify(token: any): string;
