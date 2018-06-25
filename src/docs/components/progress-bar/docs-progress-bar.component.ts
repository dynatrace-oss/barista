import { Component } from '@angular/core';
import { DefaultProgressBarExampleComponent } from './examples/default-progress-bar-example.component';
import { WithRtlProgressBarExampleComponent } from './examples/with-rtl-progress-bar-example.component';
import { ChangeProgressBarExampleComponent } from './examples/change-progress-bar-example.component';
import { WithColorProgressBarExampleComponent } from './examples/with-color-progress-bar-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-progress-bar',
  templateUrl: 'docs-progress-bar.component.html',
})
export class DocsProgressBarComponent {
  examples = {
    default: DefaultProgressBarExampleComponent,
    withRtl: WithRtlProgressBarExampleComponent,
    withColor: WithColorProgressBarExampleComponent,
    change: ChangeProgressBarExampleComponent,
  };
}
