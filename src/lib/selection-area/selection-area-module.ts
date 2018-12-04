import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtSelectionArea } from './selection-area';
import { DtSelectionAreaActions } from './selection-area-actions';
import { DtOverlayModule } from '../overlay';
import { DtSelectionAreaOrigin } from './selection-area-origin';

@NgModule({
  imports: [
    CommonModule,
    DtIconModule,
    DtButtonModule,
    DtOverlayModule,
    OverlayModule,
    A11yModule,
  ],
  exports: [
    DtSelectionArea,
    DtSelectionAreaOrigin,
    DtSelectionAreaActions,
    DtIconModule,
    DtButtonModule,
  ],
  declarations: [
    DtSelectionArea,
    DtSelectionAreaOrigin,
    DtSelectionAreaActions,
  ],
})
export class DtSelectionAreaModule {}
