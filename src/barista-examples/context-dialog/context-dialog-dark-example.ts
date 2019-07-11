// tslint:disable:max-line-length
import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <div class="dark" dtTheme=":dark">
      <dt-context-dialog
        aria-label="Show more actions"
        aria-label-close-button="Close context dialog"
      >
        <button dt-button variant="secondary">Edit</button>
      </dt-context-dialog>
      <button
        dt-icon-button
        [dtContextDialogTrigger]="darkIcondialog"
        variant="secondary"
        aria-label="Open context dialog"
      >
        <dt-icon name="agent"></dt-icon>
      </button>
      <dt-context-dialog
        #darkIcondialog
        aria-label="Open context dialog"
        aria-label-close-button="Close context dialog"
      >
        <p>
          Your dashboard "real user monitoring"
          <br />
          is only visible to you
        </p>
      </dt-context-dialog>
    </div>
  `,
})
export class ContextDialogDarkExample {}
// tslint:enable:max-line-length
