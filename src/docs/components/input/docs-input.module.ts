import { NgModule } from '@angular/core';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtInputModule } from '@dynatrace/angular-components/input';
import { DtThemingModule } from '@dynatrace/angular-components/theming';
import { DocsInputComponent } from './docs-input.component';
import { DefaultInputExample } from './examples/input-default-example';

const EXAMPLES = [
  DefaultInputExample,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtInputModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsInputComponent,
  ],
  exports: [
    DocsInputComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsInputModule {
}
