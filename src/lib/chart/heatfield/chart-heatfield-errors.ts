/** Creates an error when a heatfield is used in a chart that does not support heatfields. */
export function getDtHeatfieldUnsupportedChartError(): Error {
  return Error(
    'Trying to use a heatfield in a chart that does not support heatfields. Only time based xAxis are supported.'
  );
}
