import { Component } from '@angular/core';

@Component({
  template: `<dt-copy-clipboard (copied)="copyCallback()">
  <textarea dtInput>https://inzx79.dynatrace.com/</textarea>
  <dt-copy-clipboard-btn>Copy</dt-copy-clipboard-btn>
</dt-copy-clipboard>`,
})
export class CallbackCopyClipboardExampleComponent { 
    copyCallback () {
        alert("here we go");
    }
}
