/** Creates an error to be thrown when attempting to use an autocomplete trigger without a panel. */
export function getDtAutocompleteMissingPanelError(): Error {
  return Error(
    'Attempting to open an undefined instance of `dt-autocomplete`. ' +
      'Make sure that the id passed to the `dtAutocomplete` is correct and that ' +
      "you're attempting to open it after the ngAfterContentInit hook.",
  );
}
