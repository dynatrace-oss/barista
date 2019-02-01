import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <button dt-button (click)="resetExample()">Start example</button>

    <dt-confirmation-dialog
      [state]="dialogState"
      [showBackdrop]="showBackdrop"
      aria-label="Dialog for changes that need to be confirmed or rejected"
    >
      <dt-confirmation-dialog-state name="cancel">
        <dt-confirmation-dialog-actions>
          <button dt-button (click)="cancel()">Cancel</button>
        </dt-confirmation-dialog-actions>
      </dt-confirmation-dialog-state>
      <dt-confirmation-dialog-state name="backdrop">
        Showing backdrop for 3 seconds... only then can you leave.
      </dt-confirmation-dialog-state>
    </dt-confirmation-dialog>
  `,
})
export class ConfirmationDialogShowBackdropExample {
  dialogState: string | null;
  showBackdrop: boolean;

  cancel(): void {
    this.dialogState = 'backdrop';
    setTimeout(() => {
      this.showBackdrop = false;
      this.dialogState = null;
    }, 3000);
  }

  resetExample(): void {
    this.dialogState = 'cancel';
    this.showBackdrop = true;
  }
}
