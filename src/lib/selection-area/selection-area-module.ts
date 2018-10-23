import { NgModule } from '@angular/core';
import { DtSelectionArea, DtSelectionAreaActions } from './selection-area';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { DtButtonModule } from '@dynatrace/angular-components/button';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    DtIconModule,
    DtButtonModule,
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
