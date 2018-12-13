import {Component} from '@angular/core';

@Component({
  template: `<dt-context-dialog #contextdialog color="cta">
    <dt-copy-to-clipboard (afterCopy)="contextdialog.close()">
      <input dtInput value="https://context.dynatrace.com" />
      <dt-copy-to-clipboard-label>Copy</dt-copy-to-clipboard-label>
    </dt-copy-to-clipboard>
  </dt-context-dialog>`,
})
export class ContextCopyToClipboardExampleComponent {

}
