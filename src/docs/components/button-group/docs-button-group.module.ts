import { NgModule } from '@angular/core';
import { ButtonGroupExampleComponent } from './examples/button-group-example.component';
import { DocsButtonGroupComponent } from './docs-button-group.component';
import { UiModule } from '../../ui/ui.module';
import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtButtonGroupModule } from '@dynatrace/angular-components/button-group';
import { CommonModule } from '@angular/common';

const EXAMPLES = [
  ButtonGroupExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtButtonModule,
    DtButtonGroupModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsButtonGroupComponent,
  ],
  exports: [
    DocsButtonGroupComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsButtonGroupModule {
}
