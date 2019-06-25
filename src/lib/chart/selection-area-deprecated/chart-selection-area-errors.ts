/**
 * @deprecated The selection are will be replaced with the chart selection area
 * @breaking-change To be removed with 4.0.0.
 * @internal Error when the dtChartSelectionArea is used in a chart that does not have a datetime x axis
 */
export function getDtChartSelectionAreaDateTimeAxisError(): Error {
  return Error('DtChartSelectionArea can only be used with charts that have a datetime x-axis');
}
