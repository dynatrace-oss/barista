import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtKeyValueList } from './key-value-list';
import { DtKeyValueListItem, DtKeyValueListKey, DtKeyValueListValue } from './key-value-list-item';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    DtKeyValueList,
    DtKeyValueListItem,
    DtKeyValueListKey,
    DtKeyValueListValue,
  ],
  declarations: [
    DtKeyValueList,
    DtKeyValueListItem,
    DtKeyValueListKey,
    DtKeyValueListValue,
  ],
})
export class DtKeyValueListModule {}
