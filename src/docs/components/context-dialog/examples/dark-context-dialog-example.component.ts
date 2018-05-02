
import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
  <div class="dark" dtTheme=":dark">
  <button dt-button variant="secondary">Copy to dashboard</button>
  <dt-context-dialog>
  <button dt-button variant="secondary">Edit</button>
  </dt-context-dialog>
  </div>`,
})
export class DarkContextDialogExampleComponent { }
