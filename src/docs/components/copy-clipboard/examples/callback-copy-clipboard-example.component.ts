import {Component} from '@angular/core';

@Component({
  template: `
    <dt-copy-clipboard (copied)="copyCallback()">
      <textarea dtInput>https://copyexample.dynatrace.com/</textarea>
      <dt-copy-clipboard-btn>Copy</dt-copy-clipboard-btn>
    </dt-copy-clipboard>`,
})
export class CallbackCopyClipboardExampleComponent {
  copyCallback(): void {
    alert('done');
  }
}
