export declare function dtConvertToMilliseconds(
  duration: number,
  inputUnit: DtTimeUnit,
): number | undefined;

export declare function dtTransformResult(
  duration: number,
  inputUnit: DtTimeUnit,
  formatMethod: DurationMode,
): Map<DtTimeUnit, string> | undefined;

export declare function dtTransformResultPrecise(
  duration: number,
  inputUnit: DtTimeUnit,
  outputUnit: DtTimeUnit | undefined,
  formatMethod: DurationMode,
): Map<DtTimeUnit, string> | undefined;
