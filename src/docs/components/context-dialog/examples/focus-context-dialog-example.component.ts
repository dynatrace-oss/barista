import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
  <button dt-button variant="secondary">Copy to dashboard</button>
  <dt-context-dialog>
  <button dt-button variant="secondary" disabled="true">Disabled</button>
  <button dt-button variant="secondary">Focused</button>
  </dt-context-dialog>`,
})
export class FocusContextDialogExampleComponent { }
