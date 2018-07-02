import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtKeyValueList } from './key-value-list';
import { DtKeyValueListItem } from './key-value-list-item';

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
