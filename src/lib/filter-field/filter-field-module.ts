import { NgModule } from '@angular/core';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { DtFilterField } from './filter-field';
import { _DtFilterFieldTag } from './filter-field-tag';
import { DtButtonModule } from '@dynatrace/angular-components/button';

@NgModule({
  imports: [
    DtIconModule,
    DtButtonModule,
  ],
  exports: [
    DtFilterField,
    _DtFilterFieldTag,
  ],
  declarations: [
    DtFilterField,
    _DtFilterFieldTag,
  ],
})
export class DtFilterFieldModule { }
