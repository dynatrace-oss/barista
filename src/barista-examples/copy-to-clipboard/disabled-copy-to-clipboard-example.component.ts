import {Component} from '@angular/core';

@Component({
  template: `
    <dt-copy-to-clipboard #copyClipboard [disabled]="_toggleValue">
      <textarea dtInput aria-label="Text that is copied to clipboard">https://inzx79.dynatrace.com/</textarea>
      <dt-copy-to-clipboard-label>Copy</dt-copy-to-clipboard-label>
    </dt-copy-to-clipboard>
    <br/>
    <button dt-button (click)="_toggleValue = !_toggleValue">Toggle</button>`,
})
export class DisabledCopyToClipboardExampleComponent {
  _toggleValue = true;
}
