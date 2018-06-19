import {Component} from '@angular/core';

@Component({
  template: `
    <dt-copy-clipboard>
      <textarea dtInput>https://defaultcopy.dynatrace.com/</textarea>
      <dt-copy-clipboard-btn>Copy</dt-copy-clipboard-btn>
    </dt-copy-clipboard>`,
})
export class DefaultCopyClipboardExampleComponent {
}
