import { Component } from '@angular/core';
import { DefaultCopyToClipboardExampleComponent } from './examples/default-copy-to-clipboard-example.component';
import { CallbackCopyToClipboardExampleComponent } from './examples/callback-copy-to-clipboard-example.component';
import { DisabledCopyToClipboardExampleComponent } from './examples/disabled-copy-to-clipboard-example.component';
import { DarkCopyToClipboardExampleComponent } from './examples/dark-copy-to-clipboard-example.component';
import {ContextCopyToClipboardExampleComponent} from './examples/context-copy-to-clipboard-example.component';

@Component({
  selector: 'docs-copy-to-clipboard',
  templateUrl: './docs-copy-to-clipboard.component.html',
})
export class DocsCopyToClipboardComponent {

  examples = {
    default: DefaultCopyToClipboardExampleComponent,
    callback: CallbackCopyToClipboardExampleComponent,
    disabled : DisabledCopyToClipboardExampleComponent,
    dark : DarkCopyToClipboardExampleComponent,
    context : ContextCopyToClipboardExampleComponent,
  };
}
