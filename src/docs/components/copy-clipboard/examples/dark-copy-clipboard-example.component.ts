import {Component} from '@angular/core';

@Component({
  template: `
    <section class="dark" dtTheme=":dark">
      <dt-copy-clipboard>
        <textarea dtInput>https://dark.dynatrace.com/</textarea>
        <dt-copy-clipboard-btn>Copy</dt-copy-clipboard-btn>
      </dt-copy-clipboard>
    </section>`,
})
export class DarkCopyClipboardExampleComponent {
}
