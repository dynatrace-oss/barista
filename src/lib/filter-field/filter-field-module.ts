import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtAutocompleteModule } from '@dynatrace/angular-components/autocomplete';
import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtButtonGroupModule } from '@dynatrace/angular-components/button-group';
import { DtOptionModule } from '@dynatrace/angular-components/core';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { DtInputModule } from '@dynatrace/angular-components/input';
import { DtLoadingDistractorModule } from '@dynatrace/angular-components/loading-distractor';

import { DtFilterField } from './filter-field';
import { DtFilterFieldRange } from './filter-field-range/filter-field-range';
import { DtFilterFieldRangeTrigger } from './filter-field-range/filter-field-range-trigger';
import { DtFilterFieldTag } from './filter-field-tag/filter-field-tag';

@NgModule({
  imports: [
    CommonModule,
    DtIconModule,
    DtButtonModule,
    DtOptionModule,
    DtAutocompleteModule,
    DtInputModule,
    DtButtonGroupModule,
    DtLoadingDistractorModule,
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
export class DtFilterFieldModule {}
