import { Component } from '@angular/core';
import { DefaultCopyClipboardExampleComponent } from './examples/default-copy-clipboard-example.component';
import { CallbackCopyClipboardExampleComponent } from './examples/callback-copy-clipboard-example.component';
import { TextCopyClipboardExampleComponent } from './examples/text-copy-clipboard-example.component';

@Component({
  selector: 'docs-copy-clipboard',
  templateUrl: './docs-copy-clipboard.component.html',
  styleUrls: ['./docs-copy-clipboard.component.css'],
})
export class DocsCopyClipboardComponent {

  examples = {
    default: DefaultCopyClipboardExampleComponent,
    callback: CallbackCopyClipboardExampleComponent,
    text : TextCopyClipboardExampleComponent
  };
}
