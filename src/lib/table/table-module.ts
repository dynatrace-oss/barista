import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { DtTable } from './table';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { DtIndicatorModule } from '@dynatrace/angular-components/core';
import { DtSortHeader } from './sort/sort-header';
import { DtSort } from './sort/sort';
import { DtButtonModule } from '@dynatrace/angular-components/button';
import {
  DtHeaderRow,
  DtHeaderRowDef,
  DtHeaderCell,
  DtHeaderCellDef,
} from './header/index';
import { DtRow, DtRowDef } from './row';
import { DtCell, DtCellDef, DtColumnDef } from './cell';
import { DtExpandableCell, DtExpandableRow } from './expandable/index';
import {
  DtTableEmptyState,
  DtTableEmptyStateDirective,
  DtTableEmptyStateImage,
  DtTableEmptyStateTitle,
  DtTableEmptyStateMessage,
  DtTableLoadingState,
} from './states/index';
import { DtFormattersModule } from '@dynatrace/angular-components/formatters';
import {
  DtSimpleNumberColumn,
  DtSimpleTextColumn,
} from './simple-columns/index';

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
  DtSimpleTextColumn,
  DtSimpleNumberColumn,
];

@NgModule({
  imports: [
    CommonModule,
    CdkTableModule,
    DtIconModule,
    DtButtonModule,
    DtIndicatorModule,
    DtFormattersModule,
  ],
  exports: [...EXPORTED_DECLARATIONS, DtIndicatorModule],
  declarations: [...EXPORTED_DECLARATIONS],
})
export class DtTableModule {}
