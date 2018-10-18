import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtAutocompleteTrigger } from './autocomplete-trigger';
import { DtAutocomplete } from './autocomplete';

@NgModule({
  imports: [CommonModule],
  exports: [
    DtAutocompleteTrigger,
    DtAutocomplete,
  ],
  declarations: [
    DtAutocompleteTrigger,
    DtAutocomplete,
  ],
})
export class DtAutocompleteModule {
}
