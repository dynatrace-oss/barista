import { Component, ViewChild, ElementRef } from '@angular/core';
import { timer } from 'rxjs/internal/observable/timer';

@Component({
  template: `
    <dt-copy-to-clipboard (copied)="copyCallback()">
      <textarea dtInput>https://copyexample.dynatrace.com/</textarea>
      <dt-copy-to-clipboard-label>Copy</dt-copy-to-clipboard-label>
    </dt-copy-to-clipboard>
    <br/>
    <div #callbackresult>
      Will change after copy
    </div>`,
})
export class CallbackCopyToClipboardExampleComponent {
  @ViewChild('callbackresult') callbackResult: ElementRef;

  copyCallback(): void {
    this.callbackResult.nativeElement.innerHTML = 'Copy was done';
    // tslint:disable-next-line:no-magic-numbers
    timer(2500).subscribe((): void => {
      this.callbackResult.nativeElement.innerHTML = 'Will change after copy';
    });
  }
}
