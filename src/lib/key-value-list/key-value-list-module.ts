import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtKeyValueList } from './key-value-list';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    DtKeyValueList,
  ],
  declarations: [
    DtKeyValueList,
  ],
})
export class DtKeyValueListModule {}
