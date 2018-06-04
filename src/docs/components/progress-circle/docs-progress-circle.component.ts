import { Component } from '@angular/core';
import { DefaultProgressCircleExampleComponent } from './examples/default-progress-circle-example.component';
import { WithIconProgressCircleExampleComponent } from './examples/with-icon-progress-circle-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-progress-circle',
  templateUrl: 'docs-progress-circle.component.html',
  styleUrls: ['docs-progress-circle.component.scss'],
})
export class DocsProgressCircleComponent {
  examples = {
    default: DefaultProgressCircleExampleComponent,
    withIcon: WithIconProgressCircleExampleComponent,
  };
}
