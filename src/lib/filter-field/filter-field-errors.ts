
export function getDtFilterFieldRangeDuplicatedOperatorError(operatorType: string): Error {
  return Error(`An filter field range operator was already declared with 'type="${operatorType}"'.`);
}

export function getDtFilterFieldRangeNoOperatorsError(): Error {
  return Error('There were no filter field range operators enabled.');
}
