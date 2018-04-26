import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { DtTable } from './table';
import { DtHeaderRow, DtHeaderRowDef, DtRow, DtRowDef } from './row';
import { DtCell, DtCellDef, DtColumnDef, DtHeaderCell, DtHeaderCellDef } from './cell';
import {
  DtTableEmptyState,
  DtTableEmptyStateImage,
  DtTableEmptyStateTitle,
  DtTableEmptyStateMessage,
  DtTableEmptyStateDirective,
} from './table-empty-state';
import { DtTableLoadingState } from './table-loading-state';

const EXPORTED_DECLARATIONS = [
  DtTable,
  DtHeaderRow,
  DtHeaderRowDef,
  DtRow,
  DtRowDef,
  DtCell,
  DtCellDef,
  DtColumnDef,
  DtHeaderCell,
  DtHeaderCellDef,
  DtTableEmptyState,
  DtTableEmptyStateDirective,
  DtTableEmptyStateImage,
  DtTableEmptyStateTitle,
  DtTableEmptyStateMessage,
  DtTableLoadingState,
];

@NgModule({
  imports: [
    CommonModule,
    CdkTableModule,
  ],
  exports: [
    ...EXPORTED_DECLARATIONS,
  ],
  declarations: [
    ...EXPORTED_DECLARATIONS,
  ],
})
export class DtTableModule {}
