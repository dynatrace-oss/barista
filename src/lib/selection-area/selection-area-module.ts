import { NgModule } from '@angular/core';
import { DtSelectionArea, DtSelectionAreaActions } from './selection-area';
import { CommonModule } from '@angular/common';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtOverlayModule } from '../overlay';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  imports: [
    CommonModule,
    DtIconModule,
    DtButtonModule,
    DtOverlayModule,
    OverlayModule,
  ],
  exports: [
    DtSelectionArea,
    DtSelectionAreaActions,
    DtIconModule,
    DtButtonModule,
  ],
  declarations: [
    DtSelectionArea,
    DtSelectionAreaActions,
  ],
})
export class DtSelectionAreaModule {}
