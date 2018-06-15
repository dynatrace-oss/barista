import { Component, ViewChild } from '@angular/core';
import { DtCopyClipboard, DtButton } from '@dynatrace/angular-components';

@Component({
  template: `<dt-copy-clipboard dtTheme=":dark">
  <textarea dtInput>https://ytnzh7i9.dynatrace.com/</textarea>
  <dt-copy-clipboard-btn>Copy</dt-copy-clipboard-btn>
</dt-copy-clipboard>`,
})
export class DarkCopyClipboardExampleComponent {
    
}
