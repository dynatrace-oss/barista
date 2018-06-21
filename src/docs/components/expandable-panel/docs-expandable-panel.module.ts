import { NgModule } from '@angular/core';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtButtonModule, DtExpandablePanelModule } from '@dynatrace/angular-components';
import {DefaultExpandablePanelExampleComponent} from './examples/expandable-panel-default-example.component';
import {TriggerExpandablePanelExampleComponent} from './examples/expandable-panel-trigger-example.component';
import {OpenExpandablePanelExampleComponent} from './examples/expandable-panel-open-example.component';
import {TriggerSimpleExpandablePanelExampleComponent} from './examples/expandable-panel-trigger-simple-example.component';

const EXAMPLES = [
  DefaultExpandablePanelExampleComponent,
  TriggerExpandablePanelExampleComponent,
  OpenExpandablePanelExampleComponent,
  TriggerSimpleExpandablePanelExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtButtonModule,
    DtExpandablePanelModule,
  ],
  declarations: [
    ...EXAMPLES,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsExpandablePanelModule {
}
