import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtEmptyState } from './empty-state';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    DtEmptyState,
  ],
  declarations: [
    DtEmptyState,
  ],
})
export class DtEmptyStateModule {}
