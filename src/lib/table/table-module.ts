import { NgModule } from '@angular/core';
import { DtTable } from './table';
import { DtHeaderRow, DtHeaderRowDef, DtRow, DtRowDef } from './row';
import { DtCell, DtCellDef, DtColumnDef, DtHeaderCell, DtHeaderCellDef } from './cell';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';

const EXPORT_DECLARATIONS = [
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
  imports: [CdkTableModule, CommonModule],
  exports: [
    ...EXPORT_DECLARATIONS,
  ],
  declarations: [
    ...EXPORT_DECLARATIONS,
  ],
})
export class DtTableModule {}
