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
import { DtExpandableRow } from './expandable-row';
import { DtExpandableCell } from './expandable-cell';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { DtIndicatorModule } from '@dynatrace/angular-components/core';
import { DtSortHeader } from './sort/sort-header';
import { DtSort } from './sort/sort';
import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtInfoGroupCell, DtInfoGroupCellIcon, DtInfoGroupCellTitle } from './info-group-cell/info-group-cell';

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
// tslint:disable-next-line: deprecation
  DtInfoGroupCell,
// tslint:disable-next-line: deprecation
  DtInfoGroupCellIcon,
// tslint:disable-next-line: deprecation
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
