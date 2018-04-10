import { Component } from '@angular/core';
import { ButtonGroupExampleComponent } from './examples/button-group-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-button-group',
  styleUrls: ['./docs-button-group.component.scss'],
  templateUrl: './docs-button-group.component.html',
})
export class DocsButtonGroupComponent {

  examples = {
    simple: ButtonGroupExampleComponent,
  };
}
