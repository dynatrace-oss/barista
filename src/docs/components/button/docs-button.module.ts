import { NgModule } from '@angular/core';
import { DefaultButtonExampleComponent } from './examples/button-default-example.component';
import { InteractionButtonExampleComponent } from './examples/button-interaction-example.component';
import { VariantButtonExampleComponent } from './examples/button-variant-example.component';
import { ColorButtonExampleComponent } from './examples/button-color-example.component';
import { AllButtonExampleComponent } from './examples/button-all-example.component';
import { DarkButtonExampleComponent } from './examples/button-dark-example.component';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtButtonModule, DtThemingModule, DtIconModule } from '@dynatrace/angular-components';
import { IconsButtonExampleComponent } from './examples/button-icons-example.component';
import { IconOnlyButtonExampleComponent } from './examples/button-icon-only-example.component';
import { DisabledButtonExampleComponent } from './examples/button-disabled-example.component';

export const EXAMPLES = [
  DefaultButtonExampleComponent,
  InteractionButtonExampleComponent,
  VariantButtonExampleComponent,
  ColorButtonExampleComponent,
  IconsButtonExampleComponent,
  IconOnlyButtonExampleComponent,
  DisabledButtonExampleComponent,
  DarkButtonExampleComponent,
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
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
  providers: [
    { provide: COMPONENT_EXAMPLES, useValue: EXAMPLES, multi: true },
  ],
})
export class DocsButtonModule {
}
