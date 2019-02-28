/** Checks if the provided value is defined and not null */
// tslint:disable-next-line:no-any
export function isDefined(value: any): boolean {
  return value !== void 0 && value !== null;
}

/** Checks if the provided value is not empty and not null */
// tslint:disable-next-line:no-any
export function isEmpty(value: any): boolean {
  return value === null || value === undefined || value === '';
}

/**
 * Checks if the provided value is a number
 * this function can be used to check for numbers instead of corceNumberProperty from the cdk
 * because coerceNumberProperty returns 0 for invalid values
 */
// tslint:disable-next-line:no-any
export function isNumber(value: any): boolean {
  // parsefloat handles null, '', NaN, undefined - for everything else we check with Number
  // tslint:disable-next-line:no-any
  return typeof value !== 'symbol' && !isNaN(parseFloat(value)) && !isNaN(Number(value));
}

/** Checks if the provided value is a real object. */
// tslint:disable-next-line: no-any
export function isObject(value: any): boolean {
  return isDefined(value) && typeof value === 'object' && !Array.isArray(value);
}
