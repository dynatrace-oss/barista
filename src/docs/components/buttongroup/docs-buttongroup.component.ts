import { Component } from '@angular/core';
import { ButtongroupExampleComponent } from './examples/buttongroup-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-buttongroup',
  styleUrls: ['./docs-buttongroup.component.scss'],
  templateUrl: './docs-buttongroup.component.html',
})
export class DocsButtongroupComponent {

  examples = {
    simple: ButtongroupExampleComponent,
  };
}
