import { NgModule } from '@angular/core';
import { ButtonExampleComponent } from './examples/button-example.component';
import { DocsButtonComponent } from './docs-button.component';
import { UiModule } from '../../ui/ui.module';
import { DtButtonModule } from '@dynatrace/angular-components/button';

const EXAMPLES = [
  ButtonExampleComponent,
];

@NgModule({
  imports: [
    UiModule,
    DtButtonModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsButtonComponent,
  ],
  exports: [
    DocsButtonComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsButtonModule {
}
