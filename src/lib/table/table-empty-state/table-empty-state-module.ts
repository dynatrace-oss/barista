import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtTableEmptyState } from './table-empty-state';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    DtTableEmptyState,
  ],
  declarations: [
    DtTableEmptyState,
  ],
})
export class DtTableEmptyStateModule {}
