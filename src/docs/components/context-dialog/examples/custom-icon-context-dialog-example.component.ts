import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
  <div class="light" dtTheme=":light">
  <dt-context-dialog>
  <dt-icon dtContextDialogIcon name="agent" color="main"></dt-icon>
  <div>Example Content</div>
  </dt-context-dialog>
  </div>`,
})
export class CustomIconContextDialogExampleComponent { }
