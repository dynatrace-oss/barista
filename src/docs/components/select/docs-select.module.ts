import { NgModule } from '@angular/core';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtSelectModule, DtCheckboxModule } from '@dynatrace/angular-components';
import { DefaultSelectExampleComponent } from './examples/default-select-example.component';
import { DisabledSelectExampleComponent } from './examples/disabled-select-example.component';

export const EXAMPLES = [
  DefaultSelectExampleComponent,
  DisabledSelectExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtSelectModule,
    DtCheckboxModule,
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
export class DocsSelectModule {
}
