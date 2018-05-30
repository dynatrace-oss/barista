import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtKeyValueList, DtKeyValueListItem } from './key-value-list';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    DtKeyValueList,
    DtKeyValueListItem,
  ],
  declarations: [
    DtKeyValueList,
    DtKeyValueListItem,
  ],
})
export class DtKeyValueListModule {}
