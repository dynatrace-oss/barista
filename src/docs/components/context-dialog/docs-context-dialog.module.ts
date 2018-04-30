import { NgModule } from '@angular/core';
import { DocsContextDialogComponent } from './docs-context-dialog.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import {
  DtContextDialogModule,
  DtButtonModule,
} from '@dynatrace/angular-components';
import { DefaultContextDialogExampleComponent } from './examples/default-context-dialog-example.component';

const EXAMPLES = [
  DefaultContextDialogExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtButtonModule,
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
