import { NgModule } from '@angular/core';
import { DocsExpandablePanelComponent } from './docs-expandable-panel.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import {DtButtonModule} from '@dynatrace/angular-components/button';
import {DtExpandablePanelModule} from '@dynatrace/angular-components/expandable-panel';
import {DefaultExpandablePanelExampleComponent} from './examples/expandable-panel-default-example.component';
import {TriggerExpandablePanelExampleComponent} from './examples/expandable-panel-trigger-example.component';
import {OpenExpandablePanelExampleComponent} from './examples/expandable-panel-open-example.component';
import {TriggerSimpleExpandablePanelExampleComponent} from './examples/expandable-panel-trigger-simple-example.component';

const EXAMPLES = [
  DefaultExpandablePanelExampleComponent,
  TriggerExpandablePanelExampleComponent,
  OpenExpandablePanelExampleComponent,
  TriggerSimpleExpandablePanelExampleComponent
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
    DocsExpandablePanelComponent,
  ],
  exports: [
    DocsExpandablePanelComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsExpandablePanelModule {
}
