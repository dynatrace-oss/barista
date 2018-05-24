import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
  <div class="dark" dtTheme=":dark">
  <dt-context-dialog>
  <dt-icon dtContextDialogIcon name="agent" color="light"></dt-icon>
  <div>Example Content</div>
  </dt-context-dialog>
  </div>`,
})
export class DarkThemeCustomIconContextDialogExampleComponent { }
