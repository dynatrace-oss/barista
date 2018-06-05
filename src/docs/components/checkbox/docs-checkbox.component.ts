import { Component } from '@angular/core';
import { DefaultCheckboxExampleComponent } from './examples/default-checkbox-example';
import { IndeterminateCheckboxExampleComponent } from './examples/indeterminate-checkbox-example';
import { DarkCheckboxExample } from './examples/dark-checkbox-example';

@Component({
  moduleId: module.id,
  selector: 'docs-checkbox',
  templateUrl: 'docs-checkbox.component.html',
})
export class DocsCheckboxComponent {
  examples = {
    default: DefaultCheckboxExampleComponent,
    indeterminate: IndeterminateCheckboxExampleComponent,
    dark: DarkCheckboxExample,
  };
}
