import { Component, ViewChild } from '@angular/core';
import { DtCopyClipboard, DtButton } from '@dynatrace/angular-components';

@Component({
  template: `<dt-copy-clipboard #copyClipboard [enabled]="_toggleValue">
  <textarea dtInput>https://inzx79.dynatrace.com/</textarea>
  <dt-copy-clipboard-btn>Copy</dt-copy-clipboard-btn>
</dt-copy-clipboard>
<br/>
<button  dt-button (click)="toggleCopy()">Toggle</button>`,
})
export class DisabledCopyClipboardExampleComponent {
    @ViewChild("copyClipboard") copyElement : DtCopyClipboard;
    private _toggleValue : boolean = false;
    toggleCopy () {
        this._toggleValue = ! this._toggleValue;
    }  
}
