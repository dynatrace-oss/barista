import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtIconModule } from '@dynatrace/barista-components/icon';

import { DtPagination } from './pagination';

@NgModule({
  imports: [CommonModule, DtIconModule, DtButtonModule],
  exports: [DtPagination],
  declarations: [DtPagination],
})
export class DtPaginationModule {}
