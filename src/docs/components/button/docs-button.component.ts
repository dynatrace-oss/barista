import { Component } from '@angular/core';
import { ButtonExampleComponent } from './examples/button-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-button',
  styleUrls: ['./docs-button.component.scss'],
  templateUrl: './docs-button.component.html',
})
export class DocsButtonComponent {

  examples = {
    simple: ButtonExampleComponent,
  };
}
