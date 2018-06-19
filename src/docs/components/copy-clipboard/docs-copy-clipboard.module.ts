import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DtThemingModule,
  DtCopyClipboardModule,
  DtInputModule,
  DtButtonModule,
  DtContextDialogModule } from '@dynatrace/angular-components';
import { UiModule } from '../../ui/ui.module';
import { DocsCopyClipboardComponent } from './docs-copy-clipboard.component';
import { DefaultCopyClipboardExampleComponent } from './examples/default-copy-clipboard-example.component';
import { CallbackCopyClipboardExampleComponent } from './examples/callback-copy-clipboard-example.component';
import { TextCopyClipboardExampleComponent } from './examples/text-copy-clipboard-example.component';
import { DisabledCopyClipboardExampleComponent } from './examples/disabled-copy-clipboard-example.component';
import { DarkCopyClipboardExampleComponent } from './examples/dark-copy-clipboard-example.component';
import {ContextCopyClipboardExampleComponent} from './examples/context-copy-clipboard-example.component';

const EXAMPLES = [
  DefaultCopyClipboardExampleComponent,
  CallbackCopyClipboardExampleComponent,
  TextCopyClipboardExampleComponent,
  DisabledCopyClipboardExampleComponent,
  DarkCopyClipboardExampleComponent,
  ContextCopyClipboardExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    DtThemingModule,
    UiModule,
    DtContextDialogModule,
    DtButtonModule,
    DtCopyClipboardModule,
    DtInputModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsCopyClipboardComponent,
  ],
  exports: [
    DocsCopyClipboardComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsCopyClipboardModule { }
