import { Component } from '@angular/core';
import { DefaultCheckboxExampleComponent } from './examples/default-checkbox-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-checkbox',
  templateUrl: 'docs-checkbox.component.html',
  styleUrls: ['docs-checkbox.component.scss'],
})
export class DocsCheckboxComponent {
  examples = {
    default: DefaultCheckboxExampleComponent,
  };
}
