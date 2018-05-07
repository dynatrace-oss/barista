import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
  <button dt-button variant="secondary">Copy to dashboard</button>
  <dt-context-dialog>
  <p>Your dashboard "real user monitoring"<br> is only visible to you</p>
  <button dt-button variant="secondary">Share</button>
  </dt-context-dialog>`,
})
export class DefaultContextDialogExampleComponent { }
