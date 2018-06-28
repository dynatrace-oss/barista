import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DtThemingModule,
  DtCopyToClipboardModule,
  DtInputModule,
  DtButtonModule,
  DtContextDialogModule } from '@dynatrace/angular-components';
import { UiModule } from '../../ui/ui.module';
import { DocsCopyToClipboardComponent } from './docs-copy-to-clipboard.component';
import { DefaultCopyToClipboardExampleComponent } from './examples/default-copy-to-clipboard-example.component';
import { CallbackCopyToClipboardExampleComponent } from './examples/callback-copy-to-clipboard-example.component';
import { DisabledCopyToClipboardExampleComponent } from './examples/disabled-copy-to-clipboard-example.component';
import { DarkCopyToClipboardExampleComponent } from './examples/dark-copy-to-clipboard-example.component';
import {ContextCopyToClipboardExampleComponent} from './examples/context-copy-to-clipboard-example.component';

const EXAMPLES = [
  DefaultCopyToClipboardExampleComponent,
  CallbackCopyToClipboardExampleComponent,
  DisabledCopyToClipboardExampleComponent,
  DarkCopyToClipboardExampleComponent,
  ContextCopyToClipboardExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    DtThemingModule,
    UiModule,
    DtContextDialogModule,
    DtButtonModule,
    DtCopyToClipboardModule,
    DtInputModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsCopyToClipboardComponent,
  ],
  exports: [
    DocsCopyToClipboardComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsCopyToClipboardModule { }
