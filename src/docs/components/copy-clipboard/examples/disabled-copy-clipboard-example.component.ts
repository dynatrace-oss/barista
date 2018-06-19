import {Component} from '@angular/core';

@Component({
  template: `
    <dt-copy-clipboard #copyClipboard [enabled]="this._toggleValue">
      <textarea dtInput>https://inzx79.dynatrace.com/</textarea>
      <dt-copy-clipboard-btn>Copy</dt-copy-clipboard-btn>
    </dt-copy-clipboard>
    <br/>
    <button dt-button (click)="this._toggleValue = !this._toggleValue">Toggle</button>`,
})
export class DisabledCopyClipboardExampleComponent {
  _toggleValue = false;
}
