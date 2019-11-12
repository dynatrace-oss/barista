import { Component } from '@angular/core';

@Component({
  selector: 'component-barista-example',
  template: `
    <section class="dark" dtTheme=":dark">
      <dt-copy-to-clipboard>
        <input
          dtInput
          value="https://barista.dynatrace.com/"
          aria-label="The value of this input field will be copied to clipboard."
        />
        <dt-copy-to-clipboard-label>Copy</dt-copy-to-clipboard-label>
      </dt-copy-to-clipboard>
    </section>
  `,
})
export class CopyToClipboardDarkExample {}
