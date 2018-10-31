import { NgModule } from '@angular/core';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtOptionModule } from '@dynatrace/angular-components/core';
import { DtAutocompleteModule } from '@dynatrace/angular-components/autocomplete';
import { DtFilterField } from './filter-field';
import { DtFilterFieldOptions } from './filter-field-options';
import { DtFilterFieldTag } from './filter-field-tag/filter-field-tag';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    DtIconModule,
    DtButtonModule,
    DtOptionModule,
    DtAutocompleteModule,
  ],
  exports: [
    DtAutocompleteModule,
    DtOptionModule,
    DtFilterField,
    DtFilterFieldTag,
    DtFilterFieldOptions,
  ],
  declarations: [
    DtFilterField,
    DtFilterFieldTag,
    DtFilterFieldOptions,
  ],
})
export class DtFilterFieldModule { }
