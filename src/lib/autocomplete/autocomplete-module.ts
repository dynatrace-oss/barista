import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtOptionModule } from '@dynatrace/angular-components/core';
import { DtAutocompleteTrigger } from './autocomplete-trigger';
import { DtAutocomplete } from './autocomplete';
import { DtAutocompleteOrigin } from './autocomplete-origin';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    DtOptionModule,
  ],
  exports: [
    DtAutocompleteTrigger,
    DtAutocomplete,
    DtAutocompleteOrigin,
    DtOptionModule,
  ],
  declarations: [
    DtAutocompleteTrigger,
    DtAutocomplete,
    DtAutocompleteOrigin,
  ],
})
export class DtAutocompleteModule {
}
