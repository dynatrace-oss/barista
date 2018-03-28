import { Component } from '@angular/core';
import { DummyExampleComponent } from './examples/dummy-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-dummy',
  styleUrls: ['./docs-dummy.component.scss'],
  templateUrl: './docs-dummy.component.html',
})
export class DocsDummyComponent {

  examples = {
    simple: DummyExampleComponent,
  };
}
