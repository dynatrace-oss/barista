import { NgModule } from '@angular/core';
import {ButtonGroupDefaultExampleComponent} from './examples/button-group-default-example.component';
import {ButtonGroupDisabledExampleComponent} from './examples/button-group-disabled-example.component';
import {ButtonGroupItemDisabledExampleComponent} from './examples/button-group-item-disabled-example.component';
import {ButtonGroupInteractiveExampleComponent} from './examples/button-group-interactive-example.component';
import {ButtonGroupErrorExampleComponent} from './examples/button-group-error-example.component';
import {ButtonGroupDarkExampleComponent} from './examples/button-group-dark-example.component';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtButtonModule, DtButtonGroupModule, DtThemingModule } from '@dynatrace/angular-components';

export const EXAMPLES = [
  ButtonGroupDefaultExampleComponent,
  ButtonGroupDisabledExampleComponent,
  ButtonGroupItemDisabledExampleComponent,
  ButtonGroupInteractiveExampleComponent,
  ButtonGroupErrorExampleComponent,
  ButtonGroupDarkExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtButtonModule,
    DtButtonGroupModule,
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
export class DocsButtonGroupModule {
}
