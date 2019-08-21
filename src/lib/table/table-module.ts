import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtIndicatorModule } from '@dynatrace/angular-components/core';
import { DtEmptyStateModule } from '@dynatrace/angular-components/empty-state';
import { DtFormattersModule } from '@dynatrace/angular-components/formatters';
import { DtIconModule } from '@dynatrace/angular-components/icon';

import { DtCell, DtCellDef, DtColumnDef } from './cell';
import { DtExpandableCell, DtExpandableRow } from './expandable/index';
import {
  DtHeaderCell,
  DtHeaderCellDef,
  DtHeaderRow,
  DtHeaderRowDef,
} from './header/index';
import { DtRow, DtRowDef } from './row';
import {
  DtSimpleNumberColumn,
  DtSimpleTextColumn,
} from './simple-columns/index';
import { DtSort } from './sort/sort';
import { DtSortHeader } from './sort/sort-header';
import {
  DtTableEmptyState,
  DtTableEmptyStateDirective,
  DtTableEmptyStateImage,
  DtTableEmptyStateMessage,
  DtTableEmptyStateTitle,
  DtTableLoadingState,
} from './states/index';
import { DtTable } from './table';

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
  DtTableEmptyState, // tslint:disable-line:deprecation
  DtTableEmptyStateDirective, // tslint:disable-line:deprecation
  DtTableEmptyStateImage, // tslint:disable-line:deprecation
  DtTableEmptyStateTitle, // tslint:disable-line:deprecation
  DtTableEmptyStateMessage, // tslint:disable-line:deprecation
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
    DtEmptyStateModule,
  ],
  exports: [...EXPORTED_DECLARATIONS, DtIndicatorModule],
  declarations: [...EXPORTED_DECLARATIONS],
})
export class DtTableModule {}
