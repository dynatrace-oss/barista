export function getDtFormFieldDuplicatedHintError(align: string): Error {
  return Error(`A hint was already declared for 'align="${align}"'.`);
}

export function getDtFormFieldMissingControlError(): Error {
  return Error('dt-form-field must contain a DtFormFieldControl.');
}
