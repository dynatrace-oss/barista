import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { DtTable } from './table';
import { DtHeaderRow, DtHeaderRowDef, DtRow, DtRowDef } from './row';
import { DtCell, DtExpandableCell, DtCellDef, DtColumnDef, DtHeaderCell, DtHeaderCellDef } from './cell';
import {
  DtTableEmptyState,
  DtTableEmptyStateImage,
  DtTableEmptyStateTitle,
  DtTableEmptyStateMessage,
  DtTableEmptyStateDirective,
} from './table-empty-state';
import { DtTableLoadingState } from './table-loading-state';
import { DtExpandableRow } from './expandable-row';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { DtSortHeader } from './sort/sort-header';
import { DtSort } from './sort/sort';

const EXPORTED_DECLARATIONS = [
  DtTable,
  DtHeaderRow,
  DtHeaderRowDef,
  DtRow,
  DtRowDef,
  DtCell,
  DtCellDef,
  DtColumnDef,
  DtExpandableCell,
  DtExpandableRow,
  DtHeaderCell,
  DtHeaderCellDef,
  DtTableEmptyState,
  DtTableEmptyStateDirective,
  DtTableEmptyStateImage,
  DtTableEmptyStateTitle,
  DtTableEmptyStateMessage,
  DtTableLoadingState,
  DtSort,
  DtSortHeader,
];

@NgModule({
  imports: [
    CommonModule,
    CdkTableModule,
    DtIconModule,
  ],
  exports: [
    ...EXPORTED_DECLARATIONS,
  ],
  declarations: [
    ...EXPORTED_DECLARATIONS,
  ],
})
export class DtTableModule {}
