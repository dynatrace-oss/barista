import { Component } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  template: `
    <dt-copy-to-clipboard (copied)="copyCallback()">
      <textarea dtInput>https://copyexample.dynatrace.com/</textarea>
      <dt-copy-to-clipboard-label>Copy</dt-copy-to-clipboard-label>
    </dt-copy-to-clipboard>
    <br/>
    <div>
      {{_copyHint}}
    </div>`,
})
@OriginalClassName('CallbackCopyToClipboardExampleComponent')
export class CallbackCopyToClipboardExampleComponent {
  // tslint:disable-next-line:no-unused-variable
  _copyHint = 'Will change after copy';

  copyCallback(): void {
    this._copyHint = 'Copy was done';
    // tslint:disable-next-line:no-magic-numbers
    timer(2500).subscribe((): void => {
      this._copyHint = 'Will change after copy';
    });
  }
}
