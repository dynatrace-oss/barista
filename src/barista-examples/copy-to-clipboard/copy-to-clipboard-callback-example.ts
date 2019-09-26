import { ChangeDetectorRef, Component } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'barista-demo',
  template: `
    <dt-copy-to-clipboard (copied)="copyCallback()">
      <input
        dtInput
        [value]="_value"
        aria-label="Text that is copied to clipboard"
      />
      <dt-copy-to-clipboard-label>Copy</dt-copy-to-clipboard-label>
    </dt-copy-to-clipboard>
    <br />
    <div>
      {{ _copyHint }}
    </div>
  `,
})
export class CopyToClipboardCallbackExample {
  _value = 'https://barista.dynatrace.com/';
  _copyHint = 'Will change after copy.';

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  copyCallback(): void {
    this._copyHint = `Copied "${this._value}" to clipboard.`;
    // tslint:disable-next-line:no-magic-numbers
    timer(2500).subscribe((): void => {
      this._copyHint = 'Will change after copy.';
      this._changeDetectorRef.markForCheck();
    });
  }
}
