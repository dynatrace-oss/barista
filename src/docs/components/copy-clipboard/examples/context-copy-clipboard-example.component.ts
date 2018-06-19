import {Component} from '@angular/core';

@Component({
  template: `<dt-context-dialog #contextdialog color="cta">
    <dt-copy-clipboard (copied)="this.contextdialog.close();">
      <input dtInput value="https://context.dynatrace.com" />
      <dt-copy-clipboard-btn>Copy</dt-copy-clipboard-btn>
    </dt-copy-clipboard>
  </dt-context-dialog>`,
})
export class ContextCopyClipboardExampleComponent {

}
