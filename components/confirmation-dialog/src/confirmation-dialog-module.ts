import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtThemingModule } from '@dynatrace/angular-components/theming';

import { DtConfirmationDialog } from './confirmation-dialog';
import { DtConfirmationDialogActions } from './confirmation-dialog-actions';
import { DtConfirmationDialogState } from './confirmation-dialog-state/confirmation-dialog-state';

@NgModule({
  imports: [OverlayModule, DtThemingModule, CommonModule],
  exports: [
    DtConfirmationDialog,
    DtConfirmationDialogState,
    DtConfirmationDialogActions,
  ],
  declarations: [
    DtConfirmationDialog,
    DtConfirmationDialogState,
    DtConfirmationDialogActions,
  ],
})
export class DtConfirmationDialogModule {}
