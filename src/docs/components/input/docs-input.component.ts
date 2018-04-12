import { Component } from '@angular/core';
import { DefaultInputExample } from './examples/input-default-example';

@Component({
  moduleId: module.id,
  selector: 'docs-input',
  templateUrl: './docs-input.component.html',
})
export class DocsInputComponent {

  examples = {
    default: DefaultInputExample,
  };
}
