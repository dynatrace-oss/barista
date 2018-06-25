import {Component} from '@angular/core';

@Component({
  template: `
    <dt-copy-clipboard #copyClipboard [disabled]="_toggleValue">
      <textarea dtInput>https://inzx79.dynatrace.com/</textarea>
      <dt-copy-clipboard-label>Copy</dt-copy-clipboard-label>
    </dt-copy-clipboard>
    <br/>
    <button dt-button (click)="_toggleValue = !_toggleValue">Toggle</button>`,
})
export class DisabledCopyClipboardExampleComponent {
  _toggleValue = true;
}
