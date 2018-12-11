import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
  <div class="dark" dtTheme=":dark">
  <dt-context-dialog>
  <button dt-button variant="secondary">Edit</button>
  </dt-context-dialog>
    <button dt-icon-button [dtContextDialogTrigger]="darkIcondialog" variant="secondary"><dt-icon name="agent"></dt-icon></button>
    <dt-context-dialog #darkIcondialog>
      <p>Your dashboard "real user monitoring"<br> is only visible to you</p>
    </dt-context-dialog>
  </div>`,
})
@OriginalClassName('DarkContextDialogExampleComponent')
export class DarkContextDialogExampleComponent { }
