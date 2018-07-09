import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DtThemingModule,
  DtCopyToClipboardModule,
  DtInputModule,
  DtButtonModule,
  DtContextDialogModule } from '@dynatrace/angular-components';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { DefaultCopyToClipboardExampleComponent } from './examples/default-copy-to-clipboard-example.component';
import { CallbackCopyToClipboardExampleComponent } from './examples/callback-copy-to-clipboard-example.component';
import { DisabledCopyToClipboardExampleComponent } from './examples/disabled-copy-to-clipboard-example.component';
import { DarkCopyToClipboardExampleComponent } from './examples/dark-copy-to-clipboard-example.component';
import { ContextCopyToClipboardExampleComponent } from './examples/context-copy-to-clipboard-example.component';

export const EXAMPLES = [
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
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
  providers: [
    { provide: COMPONENT_EXAMPLES, useValue: EXAMPLES, multi: true },
  ],
})
export class DocsCopyToClipboardModule { }
