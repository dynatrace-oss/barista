import { NgModule } from '@angular/core';
import { DefaultSelectExampleComponent } from './examples/default-select-example.component';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtSelectModule } from '@dynatrace/angular-components';

export const EXAMPLES = [
  DefaultSelectExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtSelectModule,
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
