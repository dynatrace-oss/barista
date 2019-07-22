/**
 * @deprecated The selection area will be replaced with the chart selection area
 * @breaking-change To be removed with 5.0.0.
 * @internal Error when the dtChartSelectionArea is used in a chart that does not have a datetime xAxis
 */
export function getDtChartSelectionAreaDateTimeAxisError(): Error {
  return Error(
    'DtChartSelectionArea can only be used with charts that have a datetime x-axis',
  );
}
