import { Component } from '@angular/core';
import {DefaultExpandablePanelExampleComponent} from './examples/expandable-panel-default-example.component';
import {TriggerExpandablePanelExampleComponent} from './examples/expandable-panel-trigger-example.component';
import {OpenExpandablePanelExampleComponent} from './examples/expandable-panel-open-example.component';
import {TriggerSimpleExpandablePanelExampleComponent} from './examples/expandable-panel-trigger-simple-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-button',
  styleUrls: ['./docs-expandable-panel.component.scss'],
  templateUrl: './docs-expandable-panel.component.html',
})
export class DocsExpandablePanelComponent {

  examples = {
    default: DefaultExpandablePanelExampleComponent,
    trigger: TriggerExpandablePanelExampleComponent,
    open: OpenExpandablePanelExampleComponent,
    triggerSimple: TriggerSimpleExpandablePanelExampleComponent
  };
}
