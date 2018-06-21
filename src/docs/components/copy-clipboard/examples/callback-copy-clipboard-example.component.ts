import {Component} from '@angular/core';

@Component({
  template: `
    <dt-copy-clipboard (copied)="copyCallback()">
      <textarea dtInput>https://copyexample.dynatrace.com/</textarea>
      <dt-copy-clipboard-label>Copy</dt-copy-clipboard-label>
    </dt-copy-clipboard>`,
})
export class CallbackCopyClipboardExampleComponent {
  copyCallback(): void {
    alert('done');
  }
}
