import { NgModule } from '@angular/core';
import { DocsButtonGroupComponent } from './docs-button-group.component';
import { UiModule } from '../../ui/ui.module';
import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtButtonGroupModule } from '@dynatrace/angular-components/button-group';
import { CommonModule } from '@angular/common';
import {ButtonGroupDefaultExampleComponent} from './examples/button-group-default-example.component';
import {ButtonGroupDisabledExampleComponent} from './examples/button-group-disabled-example.component';
import {ButtonGroupItemDisabledExampleComponent} from './examples/button-group-item-disabled-example.component';
import {ButtonGroupInteractiveExampleComponent} from './examples/button-group-interactive-example.component';
import {ButtonGroupErrorExampleComponent} from './examples/button-group-error-example.component';
import {DtThemingModule} from '@dynatrace/angular-components/theming';

const EXAMPLES = [
  ButtonGroupDefaultExampleComponent,
  ButtonGroupDisabledExampleComponent,
  ButtonGroupItemDisabledExampleComponent,
  ButtonGroupInteractiveExampleComponent,
  ButtonGroupErrorExampleComponent
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtButtonModule,
    DtButtonGroupModule,
    DtThemingModule
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
