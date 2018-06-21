import { NgModule } from '@angular/core';
import { DocsAlertComponent } from './docs-alert.component';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import {DtAlertModule, DtButtonModule, DtThemingModule} from '@dynatrace/angular-components';
import {WarningAlertExampleComponent} from './examples/warning-alert-example.component';
import {ErrorAlertExampleComponent} from './examples/error-alert-example.component';
import {InteractiveAlertExampleComponent} from './examples/interactive-alert-example.component';
import {DarkAlertExampleComponent} from './examples/dark-alert-example.component';

export const EXAMPLES = [
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
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
  providers: [
    { provide: COMPONENT_EXAMPLES, useValue: EXAMPLES, multi: true },
  ],
})
export class DocsAlertModule {
}
