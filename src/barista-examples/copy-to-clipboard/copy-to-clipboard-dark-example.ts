import { Component } from '@angular/core';

@Component({
  selector: 'demo-component',
  template: `
    <section class="dark" dtTheme=":dark">
      <dt-copy-to-clipboard>
        <textarea dtInput aria-label="Text that is copied to clipboard">https://dark.dynatrace.com/</textarea>
        <dt-copy-to-clipboard-label>Copy</dt-copy-to-clipboard-label>
      </dt-copy-to-clipboard>
    </section>`,
})
export class CopyToClipboardDarkExample { }
