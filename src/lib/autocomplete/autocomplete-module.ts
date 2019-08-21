import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtOptionModule } from '@dynatrace/angular-components/core';

import { DtAutocomplete } from './autocomplete';
import { DtAutocompleteOrigin } from './autocomplete-origin';
import { DtAutocompleteTrigger } from './autocomplete-trigger';

@NgModule({
  imports: [CommonModule, OverlayModule, DtOptionModule],
  exports: [
    DtAutocompleteTrigger,
    DtAutocomplete,
    DtAutocompleteOrigin,
    DtOptionModule,
  ],
  declarations: [DtAutocompleteTrigger, DtAutocomplete, DtAutocompleteOrigin],
})
export class DtAutocompleteModule {}
