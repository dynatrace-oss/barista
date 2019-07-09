import { NgModule } from '@angular/core';
import { DtPagination } from './pagination';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { CommonModule } from '@angular/common';
import { DtButtonModule } from '@dynatrace/angular-components/button';

@NgModule({
  imports: [CommonModule, DtIconModule, DtButtonModule],
  exports: [DtPagination],
  declarations: [DtPagination],
})
export class DtPaginationModule {}
