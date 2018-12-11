import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <div>
      <button *ngIf="customTrigger" dt-icon-button [dtContextDialogTrigger]="interactiveDialog"
              [disabled]="interactiveDialogDisabled" variant="secondary">
      <dt-icon name="agent"></dt-icon>
    </button>
    <dt-context-dialog #interactiveDialog [disabled]="interactiveDialogDisabled">
      <p>Your dashboard "real user monitoring"<br> is only visible to you</p>
    </dt-context-dialog>
    </div>
    <button dt-button (click)="interactiveDialog.open()">Open</button>
    <button dt-button (click)="interactiveDialog.close()">Close</button>
    <button dt-button (click)="interactiveDialogDisabled = !interactiveDialogDisabled">Disabled / Enable</button>
    <button dt-button (click)="customTrigger=!customTrigger">Toggle custom trigger</button>
    `,
})
@OriginalClassName('InteractiveContextDialogExampleComponent')
export class InteractiveContextDialogExampleComponent {
  interactiveDialogDisabled = false;
  customTrigger = false;
}
