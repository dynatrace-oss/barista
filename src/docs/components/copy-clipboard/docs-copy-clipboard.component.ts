import { Component } from '@angular/core';
import { DefaultCopyClipboardExampleComponent } from './examples/default-copy-clipboard-example.component';
import { CallbackCopyClipboardExampleComponent } from './examples/callback-copy-clipboard-example.component';
import { TextCopyClipboardExampleComponent } from './examples/text-copy-clipboard-example.component';
import { DisabledCopyClipboardExampleComponent } from './examples/disabled-copy-clipboard-example.component';
import { DarkCopyClipboardExampleComponent } from './examples/dark-copy-clipboard-example.component';
import {ContextCopyClipboardExampleComponent} from './examples/context-copy-clipboard-example.component';

@Component({
  selector: 'docs-copy-clipboard',
  templateUrl: './docs-copy-clipboard.component.html',
})
export class DocsCopyClipboardComponent {

  examples = {
    default: DefaultCopyClipboardExampleComponent,
    callback: CallbackCopyClipboardExampleComponent,
    text : TextCopyClipboardExampleComponent,
    disabled : DisabledCopyClipboardExampleComponent,
    dark : DarkCopyClipboardExampleComponent,
    context : ContextCopyClipboardExampleComponent,
  };
}
