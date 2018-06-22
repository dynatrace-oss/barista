import { Component } from '@angular/core';
import { DefaultIconExample } from './examples/icon-default-example';
import { AllIconExample } from './examples/icon-all-example';

@Component({
  moduleId: module.id,
  selector: 'docs-icon',
  templateUrl: './docs-icon.component.html',
})
export class DocsIconComponent {

  examples = {
    default: DefaultIconExample,
    all: AllIconExample,
  };
}
