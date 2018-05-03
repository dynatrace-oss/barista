import { NgModule } from '@angular/core';
import { DefaultButtonExampleComponent } from './examples/button-default-example.component';
import { SimpleButtonExampleComponent } from './examples/button-simple-example.component';
import { InteractionButtonExampleComponent } from './examples/button-interaction-example.component';
import { VariantButtonExampleComponent } from './examples/button-variant-example.component';
import { ColorButtonExampleComponent } from './examples/button-color-example.component';
import { AllButtonExampleComponent } from './examples/button-all-example.component';
import { DocsButtonComponent } from './docs-button.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtButtonModule, DtThemingModule, DtIconModule } from '@dynatrace/angular-components';
import { IconsButtonExampleComponent } from './examples/button-icons-example.component';

const EXAMPLES = [
  DefaultButtonExampleComponent,
  SimpleButtonExampleComponent,
  InteractionButtonExampleComponent,
  VariantButtonExampleComponent,
  ColorButtonExampleComponent,
  IconsButtonExampleComponent,
  AllButtonExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtButtonModule,
    DtThemingModule,
    DtIconModule,
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
