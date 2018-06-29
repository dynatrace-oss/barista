import { NgModule } from '@angular/core';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import {
  DtContextDialogModule,
  DtButtonModule,
  DtIconModule,
  DtThemingModule,
} from '@dynatrace/angular-components';
import { DefaultContextDialogExampleComponent } from './examples/default-context-dialog-example.component';
import { DarkContextDialogExampleComponent } from './examples/dark-context-dialog-example.component';
import { PrevFocusContextDialogExampleComponent } from './examples/previous-focus-context-dialog-example.component';
import { CustomIconContextDialogExampleComponent } from './examples/custom-icon-context-dialog-example.component';
import { InteractiveContextDialogExampleComponent } from './examples/interactive-context-dialog-example.component';

export const EXAMPLES = [
  DefaultContextDialogExampleComponent,
  DarkContextDialogExampleComponent,
  PrevFocusContextDialogExampleComponent,
  CustomIconContextDialogExampleComponent,
  InteractiveContextDialogExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtButtonModule,
    DtIconModule,
    DtThemingModule,
    DtContextDialogModule,
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
export class DocsContextDialogModule {
}
