import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { DtEmptyStateModule } from '@dynatrace/angular-components/empty-state';
import { DtLoadingDistractorModule } from '@dynatrace/angular-components/loading-distractor';
import { DtTable } from './table';
import { DtHeaderRow, DtHeaderRowDef, DtRow, DtRowDef } from './row';
import { DtCell, DtCellDef, DtColumnDef, DtHeaderCell, DtHeaderCellDef } from './cell';

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
];

@NgModule({
  imports: [
    CommonModule,
    CdkTableModule,
    DtEmptyStateModule,
    DtLoadingDistractorModule,
  ],
  exports: [
    ...EXPORTED_DECLARATIONS,
  ],
  declarations: [
    ...EXPORTED_DECLARATIONS,
  ],
})
export class DtTableModule {}
