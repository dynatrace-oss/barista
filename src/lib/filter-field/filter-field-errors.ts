
export function getDtFilterFieldRangeDuplicatedOperatorError(operatorType: string): Error {
  return Error(`An filter field range operator was already declared with 'type="${operatorType}"'.`);
}

export function getDtFilterFieldRangeNoOperatorsError(): Error {
  return Error('There were no filter field range operators enabled.');
}

export function getDtFilterFieldApplyFilterNoRootDataProvidedError(): Error {
  return Error('Filters can not be added because there is no data provided through the data source');
}

export function getDtFilterFieldApplyFilterParseError(): Error {
  return Error('Filters can not be added because they do not match the structure of the provided data in the data source.');
}
