import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { DtConfirmationDialog } from './confirmation-dialog';
import { DtConfirmationDialogState } from './confirmation-dialog-state/confirmation-dialog-state';
import { DtConfirmationDialogActions } from './confirmation-dialog-actions';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [OverlayModule, CommonModule],
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
