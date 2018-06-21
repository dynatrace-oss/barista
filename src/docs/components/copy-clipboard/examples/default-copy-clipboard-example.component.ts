import {Component} from '@angular/core';

@Component({
  template: `
    <dt-copy-clipboard>
      <textarea dtInput>https://defaultcopy.dynatrace.com/</textarea>
      <dt-copy-clipboard-label>Copy</dt-copy-clipboard-label>
    </dt-copy-clipboard>`,
})
export class DefaultCopyClipboardExampleComponent {
}
