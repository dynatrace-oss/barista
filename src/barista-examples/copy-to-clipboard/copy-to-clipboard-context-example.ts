import { Component } from '@angular/core';

@Component({
  selector: 'barista-demo',
  template: `
    <dt-context-dialog
      #contextdialog
      color="cta"
      aria-label="Show more actions"
      aria-label-close-button="Close context dialog"
    >
      <dt-copy-to-clipboard (afterCopy)="contextdialog.close()">
        <input
          dtInput
          value="https://context.dynatrace.com"
          aria-label="Text that is copied to clipboard"
        />
        <dt-copy-to-clipboard-label>Copy</dt-copy-to-clipboard-label>
      </dt-copy-to-clipboard>
    </dt-context-dialog>
  `,
})
export class CopyToClipboardContextExample {}
