import { NgModule } from '@angular/core';
import { DefaultToastExampleComponent } from './examples/default-toast-example.component';
import { DynamicMsgToastExampleComponent } from './examples/dynamic-msg-toast-example.component';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtToastModule, DtButtonModule, DtFormFieldModule, DtInputModule } from '@dynatrace/angular-components';
import { FormsModule } from '@angular/forms';

export const EXAMPLES = [
  DefaultToastExampleComponent,
  DynamicMsgToastExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    FormsModule,
    DtFormFieldModule,
    DtInputModule,
    DtToastModule,
    DtButtonModule,
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
export class DocsToastModule {
}
