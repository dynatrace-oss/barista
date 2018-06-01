import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
  <button *ngIf="customTrigger" dt-icon-button [dtContextDialogTrigger]="dialog"><dt-icon name="agent"></dt-icon></button>
  <dt-context-dialog #dialog>
  <p>Your dashboard "real user monitoring"<br> is only visible to you</p>
  </dt-context-dialog>
  <button dt-button (click)="customTrigger=!customTrigger">Toggle custom trigger</button>`,
})
export class DefaultContextDialogExampleComponent {
  customTrigger: true;
}

