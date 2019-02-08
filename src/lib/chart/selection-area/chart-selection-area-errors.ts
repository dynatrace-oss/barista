/** @internal */
export function getDtChartSelectionAreaDateTimeAxisError(): Error {
  return Error('DtChartSelectionArea can only be used with charts that have a datetime x-axis');
}
