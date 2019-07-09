/** @internal */
export function getDtSortHeaderNotContainedWithinSortError(): Error {
  return Error(
    `DtSortHeader must be placed within a parent element with the DtSort directive.`
  );
}

/** @internal */
export function getDtSortInvalidDirectionError(direction: string): Error {
  return Error(`${direction} is not a valid sort direction ('asc' or 'desc').`);
}
