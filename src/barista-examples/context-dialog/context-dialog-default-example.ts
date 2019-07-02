import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
  <dt-context-dialog aria-label="Show more details" aria-label-close-button="Close context dialog">
    <p>Your dashboard "real user monitoring" is only visible to you</p>
  </dt-context-dialog>
  `,
})
export class ContextDialogDefaultExample {}
