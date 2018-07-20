import { NgModule } from '@angular/core';
import { DefaultToastExampleComponent } from './examples/default-toast-example.component';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtToastModule, DtButtonModule } from '@dynatrace/angular-components';

export const EXAMPLES = [
  DefaultToastExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
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
