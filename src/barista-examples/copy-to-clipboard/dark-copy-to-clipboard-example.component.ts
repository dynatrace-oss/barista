import {Component} from '@angular/core';

@Component({
  template: `
    <section class="dark" dtTheme=":dark">
      <dt-copy-to-clipboard>
        <textarea dtInput>https://dark.dynatrace.com/</textarea>
        <dt-copy-to-clipboard-label>Copy</dt-copy-to-clipboard-label>
      </dt-copy-to-clipboard>
    </section>`,
})
export class DarkCopyToClipboardExampleComponent {}
