import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
  <button dt-icon-button [dtContextDialogTrigger]="dialog" aria-label="Open context dialog">
    <dt-icon name="agent"></dt-icon>
  </button>
  <dt-context-dialog #dialog aria-label="Open context dialog" aria-label-close-button="Close context dialog">
    <p>Your dashboard "real user monitoring"<br> is only visible to you</p>
  </dt-context-dialog>
   `,
})
export class ContextDialogCustomIconExample {
}
