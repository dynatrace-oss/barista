// tslint:disable:no-any prefer-template
export function getDtFilterFieldDataSourceUnkownOptionOrGroupTypeError(optionOrGroup: any): Error {
  return new Error(`Value does not fit the structure for an option or group and cannot be transformed. ` +
    `If your data does not fit this structure you can create your own DtFilterFieldDataSource.\n` +
    `Your Value:\n${JSON.stringify(optionOrGroup)}`);
}

export function getDtFilterFieldDataSourceUnkownOptionTypeError(option: any): Error {
  return new Error(`Value does not fit the structure for an option and cannot be transformed. ` +
    `If your data does not fit this structure you can create your own DtFilterFieldDataSource.\n` +
    `Your Value:\n${JSON.stringify(option)}`);
}

export function getDtFilterFieldDataSourceUnknowdDataTypeError(data: any): Error {
  return new Error(`Value does not fit the defined data structure and cannot be transformed. ` +
    `If your data does not fit this structure you can create your own DtFilterFieldDataSource.\n` +
    `Your Value:\n${JSON.stringify(data)}`);
}
