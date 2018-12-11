import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
  <dt-context-dialog #dialog>
  <p>Your dashboard "real user monitoring"<br> is only visible to you</p>
  </dt-context-dialog>
  `,
})
@OriginalClassName('DefaultContextDialogExampleComponent')
export class DefaultContextDialogExampleComponent {}
