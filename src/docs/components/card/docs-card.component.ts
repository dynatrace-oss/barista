import { Component } from '@angular/core';
import { DefaultCardExampleComponent } from './examples/card-default-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-card',
  styleUrls: ['./docs-card.component.scss'],
  templateUrl: './docs-card.component.html',
})
export class DocsCardComponent {

  examples = {
    default: DefaultCardExampleComponent,
  };
}
