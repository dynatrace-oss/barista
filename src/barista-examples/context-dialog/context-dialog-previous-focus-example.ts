import { Component, ViewChild } from '@angular/core';

import { DtButton } from '@dynatrace/angular-components/button';
import { DtContextDialog } from '@dynatrace/angular-components/context-dialog';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <button dt-button variant="secondary" (click)="open()" #focusme>
      Open
    </button>
    <dt-context-dialog
      #contextdialog
      color="cta"
      aria-label="Show more details"
      aria-label-close-button="Close context dialog"
    >
      <p>Close me to return the focus to the "Open" button</p>
      <button dt-button variant="secondary">Focused</button>
    </dt-context-dialog>
  `,
  styles: ['.dt-button + .dt-context-dialog { margin-left: 8px; }'],
})
export class ContextDialogPreviousFocusExample {
  @ViewChild('focusme', { static: true }) focusMe: DtButton;
  @ViewChild('contextdialog', { static: true }) contextdialog: DtContextDialog;

  open(): void {
    this.contextdialog.open();
  }
}
