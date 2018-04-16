import { Component } from '@angular/core';
import { DefaultInputExample } from './examples/input-default-example';
import { NgModelInputExample } from './examples/input-ng-model-example';
import { TextareaInputExample } from './examples/input-textarea-example';
import { DisabledReadonlyInputExample } from './examples/input-disabled-readonly-example';
import { DarkInputExample } from './examples/input-dark-example';

@Component({
  moduleId: module.id,
  selector: 'docs-input',
  templateUrl: './docs-input.component.html',
})
export class DocsInputComponent {

  examples = {
    default: DefaultInputExample,
    disabledReadonly: DisabledReadonlyInputExample,
    ngmodel: NgModelInputExample,
    textarea: TextareaInputExample,
    dark: DarkInputExample,
  };
}
