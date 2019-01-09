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
import { DtIndicatorModule } from '@dynatrace/angular-components/core';
import { DtSortHeader } from './sort/sort-header';
import { DtSort } from './sort/sort';
import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtInfoGroupCell, DtInfoGroupCellIcon, DtInfoGroupCellTitle } from './cell-templates/info-group-cell';

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
  DtInfoGroupCell,
  DtInfoGroupCellIcon,
  DtInfoGroupCellTitle,
];

@NgModule({
  imports: [
    CommonModule,
    CdkTableModule,
    DtIconModule,
    DtButtonModule,
    DtIndicatorModule,
  ],
  exports: [
    ...EXPORTED_DECLARATIONS,
    DtIndicatorModule,
  ],
  declarations: [
    ...EXPORTED_DECLARATIONS,
  ],
})
export class DtTableModule {}
