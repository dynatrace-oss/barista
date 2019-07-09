import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-context-dialog
      aria-label="Show more actions"
      aria-label-close-button="Close context dialog"
    >
      <dt-context-dialog-header>
        <dt-context-dialog-header-title>Analyse</dt-context-dialog-header-title>
        Today, 12:03 - 14:08
      </dt-context-dialog-header>
      <p>Your dashboard "real user monitoring" is only visible to you</p>
    </dt-context-dialog>
  `,
  styles: [
    `
      p {
        margin-top: 0px;
      }
    `,
  ],
})
export class ContextDialogHeaderExample {}
