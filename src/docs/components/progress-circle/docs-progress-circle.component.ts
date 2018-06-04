import { Component } from '@angular/core';
import { DefaultProgressCircleExampleComponent } from './examples/default-progress-circle-example.component';
import { WithIconProgressCircleExampleComponent } from './examples/with-icon-progress-circle-example.component';
import { ChangeProgressCircleExampleComponent } from './examples/change-progress-circle-example.component';
import { WithColorProgressCircleExampleComponent } from './examples/with-color-progress-circle-example.component';
import { WithTextProgressCircleExampleComponent } from './examples/with-text-progress-circle-example.component';

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
    withText: WithTextProgressCircleExampleComponent,
    withColor: WithColorProgressCircleExampleComponent,
    change: ChangeProgressCircleExampleComponent,
  };
}
