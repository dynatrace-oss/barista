import { NgModule } from '@angular/core';
import { DocsContextDialogComponent } from './docs-context-dialog.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import {
  DtContextDialogModule,
  DtButtonModule,
  DtThemingModule,
} from '@dynatrace/angular-components';
import { DefaultContextDialogExampleComponent } from './examples/default-context-dialog-example.component';
import { DarkContextDialogExampleComponent } from './examples/dark-context-dialog-example.component';
import { FocusContextDialogExampleComponent } from './examples/focus-context-dialog-example.component';
import { PrevFocusContextDialogExampleComponent } from './examples/previous-focus-context-dialog-example.component';

const EXAMPLES = [
  DefaultContextDialogExampleComponent,
  DarkContextDialogExampleComponent,
  FocusContextDialogExampleComponent,
  PrevFocusContextDialogExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtButtonModule,
    DtThemingModule,
    DtContextDialogModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsContextDialogComponent,
  ],
  exports: [
    DocsContextDialogComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsContextDialogModule {
}
