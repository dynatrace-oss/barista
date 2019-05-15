/**
 * Compares two strings based on a locale aware comparison.
 * TODO: There would be room for extension here based on the documentation of
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
 * we should be able to provide a stable text-sort helper function.
 * @deprecated Will be removed, please use the compareStrings function from angular-components/core.
 * @breaking-change 3.0.0 will be removed.
 */
export function compareString(a: string, b: string): number {
  return a.localeCompare(b);
}
