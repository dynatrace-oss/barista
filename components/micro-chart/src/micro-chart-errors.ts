export function getDtMicroChartUnsupportedChartTypeError(type: string): Error {
  return Error(`Series type unsupported: ${type}`);
}
