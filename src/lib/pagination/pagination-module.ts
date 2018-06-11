import {NgModule} from '@angular/core';
import {DtPagination} from './pagination';
import {DtIconModule} from '../icon/icon-module';
import {CommonModule} from '@angular/common';
import {DtButtonModule} from '../button/button-module';

@NgModule({
  imports: [
    CommonModule,
    DtIconModule,
    DtButtonModule,
  ],
  exports: [
    DtPagination,
    DtIconModule,
  ],
  declarations: [
    DtPagination,
  ],
})
export class DtPaginationModule {}
