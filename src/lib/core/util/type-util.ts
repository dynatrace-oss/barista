/** Checks if a value is defined (value is not null and undefined). */
// tslint:disable-next-line:no-any
export function isDefined(value: any): boolean {
  // We need to disable triple-equals here so we can use the `!= null` check, as it does exactly what we want.
  // tslint:disable-next-line:triple-equals
  return value != null;
}
