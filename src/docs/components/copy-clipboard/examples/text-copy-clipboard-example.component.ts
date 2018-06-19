import {Component} from '@angular/core';

@Component({
  template: `
<dt-copy-clipboard>
  <dt-copy-clipboard-source>https://textclick.dyntrace.com</dt-copy-clipboard-source>
  <dt-copy-clipboard-label>click here, to copy</dt-copy-clipboard-label>
  <dt-copy-clipboard-success>success</dt-copy-clipboard-success>
</dt-copy-clipboard>`,
})
export class TextCopyClipboardExampleComponent {
}
