import { NgModule } from '@angular/core';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtOptionModule } from '@dynatrace/angular-components/core';
import { DtAutocompleteModule } from '@dynatrace/angular-components/autocomplete';
import { DtButtonGroupModule } from '@dynatrace/angular-components/button-group';
import { DtInputModule } from '@dynatrace/angular-components/input';
import { DtFilterField } from './filter-field';
import { DtFilterFieldTag } from './filter-field-tag/filter-field-tag';
import { DtFilterFieldRange } from './filter-field-range/filter-field-range';
import { DtFilterFieldRangeTrigger } from './filter-field-range/filter-field-range-trigger';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    DtIconModule,
    DtButtonModule,
    DtOptionModule,
    DtAutocompleteModule,
    DtInputModule,
    DtButtonGroupModule,
  ],
  exports: [
    DtAutocompleteModule,
    DtOptionModule,
    DtFilterField,
    DtFilterFieldTag,
  ],
  declarations: [
    DtFilterField,
    DtFilterFieldTag,
    DtFilterFieldRange,
    DtFilterFieldRangeTrigger,
  ],
})
export class DtFilterFieldModule { }
