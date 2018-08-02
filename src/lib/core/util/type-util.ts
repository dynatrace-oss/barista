/** Checks if the provided value is defined and not null */
// tslint:disable-next-line:no-any
export function isDefined(value: any): boolean {
  return value !== void 0 && value !== null;
}
