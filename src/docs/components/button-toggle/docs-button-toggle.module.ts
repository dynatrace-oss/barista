import { NgModule } from '@angular/core';
import { DocsButtonToggleComponent } from './docs-button-toggle.component';
import { UiModule } from '../../ui/ui.module';
import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtButtonToggleModule } from '@dynatrace/angular-components/button-toggle';
import { CommonModule } from '@angular/common';
import {ButtonToggleDefaultExampleComponent} from './examples/button-toggle-default-example.component';
import {ButtonToggleDisabledExampleComponent} from './examples/button-toggle-disabled-example.component';
import {ButtonToggleItemDisabledExampleComponent} from './examples/button-toggle-item-disabled-example.component';
import {ButtonToggleInteractiveExampleComponent} from './examples/button-toggle-interactive-example.component';

const EXAMPLES = [
  ButtonToggleDefaultExampleComponent,
  ButtonToggleDisabledExampleComponent,
  ButtonToggleItemDisabledExampleComponent,
  ButtonToggleInteractiveExampleComponent
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtButtonModule,
    DtButtonToggleModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsButtonToggleComponent,
  ],
  exports: [
    DocsButtonToggleComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsButtonToggleModule {
}
