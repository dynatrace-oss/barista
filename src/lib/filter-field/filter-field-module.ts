import { NgModule } from '@angular/core';
import { DtFilterField } from './filter-field';
import { DtIconModule } from '@dynatrace/angular-components/icon';

@NgModule({
  imports: [
    DtIconModule,
  ],
  exports: [
    DtFilterField,
  ],
  declarations: [
    DtFilterField,
  ],
})
export class DtFilterFieldModule { }
