import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <button dt-button (click)="resetExample()">Start example</button>
    <dt-confirmation-dialog
      [state]="dialogState"
      aria-label="Dialog for changes that need to be confirmed or rejected"
    >
      <dt-confirmation-dialog-state name="dirty">
        You have pending changes.
        <dt-confirmation-dialog-actions>
          <button dt-button variant="secondary" (click)="clear()">Clear</button>
          <button dt-button (click)="save()">Save</button>
        </dt-confirmation-dialog-actions>
      </dt-confirmation-dialog-state>
      <dt-confirmation-dialog-state name="success">
        Successfully saved!
      </dt-confirmation-dialog-state>
    </dt-confirmation-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogDefaultExample {
  dialogState: string | null;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  save(): void {
    this.dialogState = 'success';

    setTimeout(() => {
      this.clear();
      this._changeDetectorRef.markForCheck();
    }, 2000);
  }

  clear(): void {
    this.dialogState = null;
  }

  resetExample(): void {
    this.dialogState = 'dirty';
  }
}
