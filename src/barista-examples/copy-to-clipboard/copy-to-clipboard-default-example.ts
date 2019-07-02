import { Component } from '@angular/core';

@Component({
  selector: 'barista-demo',
  template: `
    <dt-copy-to-clipboard>
      <textarea dtInput aria-label="Text that is copied to clipboard">https://defaultcopy.dynatrace.com/</textarea>
      <dt-copy-to-clipboard-label>Copy</dt-copy-to-clipboard-label>
    </dt-copy-to-clipboard>`,
})
export class CopyToClipboardDefaultExample {
}
