import { NgModule } from '@angular/core';
import { DefaultCheckboxExampleComponent } from './examples/default-checkbox-example.component';
import { DocsCheckboxComponent } from './docs-checkbox.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtCheckboxModule } from '@dynatrace/angular-components';

const EXAMPLES = [
  DefaultCheckboxExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtCheckboxModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsCheckboxComponent,
  ],
  exports: [
    DocsCheckboxComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsCheckboxModule {
}
