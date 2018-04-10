import { Component } from '@angular/core';
import { DefaultLoadingDistractorExampleComponent } from './examples/loading-distractor-default-example';
import { SpinnerLoadingDistractorExampleComponent } from './examples/loading-distractor-spinner-example';

@Component({
  moduleId: module.id,
  selector: 'docs-loading-distractor',
  styleUrls: ['./docs-loading-distractor.component.scss'],
  templateUrl: './docs-loading-distractor.component.html',
})
export class DocsLoadingDistractorComponent {

  examples = {
    default: DefaultLoadingDistractorExampleComponent,
    spinner: SpinnerLoadingDistractorExampleComponent,
  };
}
