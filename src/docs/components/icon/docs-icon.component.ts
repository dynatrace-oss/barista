import { Component } from '@angular/core';
import { DefaultIconExample } from './examples/icon-default-example';

@Component({
  moduleId: module.id,
  selector: 'docs-icon',
  templateUrl: './docs-icon.component.html',
})
export class DocsIconComponent {

  examples = {
    default: DefaultIconExample,
  };
}
