import { NgModule } from '@angular/core';
import { ButtonExampleComponent } from './examples/button-example.component';
import { DocsButtonComponent } from './docs-button.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtThemingModule } from '@dynatrace/angular-components/theming';

const EXAMPLES = [
  ButtonExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtButtonModule,
    DtThemingModule,
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
