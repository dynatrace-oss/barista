import { NgModule } from '@angular/core';
import { DefaultCheckboxExampleComponent } from './examples/default-checkbox-example';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtCheckboxModule, DtThemingModule } from '@dynatrace/angular-components';
import { IndeterminateCheckboxExampleComponent } from './examples/indeterminate-checkbox-example';
import { DarkCheckboxExample } from './examples/dark-checkbox-example';

export const EXAMPLES = [
  DefaultCheckboxExampleComponent,
  IndeterminateCheckboxExampleComponent,
  DarkCheckboxExample,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtCheckboxModule,
    DtThemingModule,
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
export class DocsCheckboxModule {
}
