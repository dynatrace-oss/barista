import {Component} from '@angular/core';

@Component({
  template: `
    <section class="dark" dtTheme=":dark">
      <dt-copy-clipboard>
        <textarea dtInput>https://dark.dynatrace.com/</textarea>
        <dt-copy-clipboard-label>Copy</dt-copy-clipboard-label>
      </dt-copy-clipboard>
    </section>`,
})
export class DarkCopyClipboardExampleComponent {
}
