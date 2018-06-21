import { NgModule } from '@angular/core';
import { DefaultCheckboxExampleComponent } from './examples/default-checkbox-example';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtCheckboxModule, DtThemingModule } from '@dynatrace/angular-components';
import { IndeterminateCheckboxExampleComponent } from './examples/indeterminate-checkbox-example';
import { DarkCheckboxExample } from './examples/dark-checkbox-example';

const EXAMPLES = [
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
})
export class DocsCheckboxModule {
}
