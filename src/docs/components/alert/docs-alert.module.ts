import { NgModule } from '@angular/core';
import { DefaultAlertExampleComponent } from './examples/default-alert-example.component';
import { DocsAlertComponent } from './docs-alert.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import {DtAlertModule, DtButtonModule, DtThemingModule} from '@dynatrace/angular-components';
import {WarningAlertExampleComponent} from './examples/warning-alert-example.component';
import {ErrorAlertExampleComponent} from './examples/error-alert-example.component';
import {InteractiveAlertExampleComponent} from './examples/interactive-alert-example.component';
import {DarkAlertExampleComponent} from './examples/dark-alert-example.component';

const EXAMPLES = [
  DefaultAlertExampleComponent,
  WarningAlertExampleComponent,
  ErrorAlertExampleComponent,
  InteractiveAlertExampleComponent,
  DarkAlertExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtButtonModule,
    DtAlertModule,
    DtThemingModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsAlertComponent,
  ],
  exports: [
    DocsAlertComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsAlertModule {
}
