import { Component } from '@angular/core';
import { DefaultKeyValueListExampleComponent } from './examples/default-key-value-list-example.component';
import { MulticolumnKeyValueListExampleComponent } from './examples/multicolumn-key-value-list-example.component';
import { LongtextKeyValueListExampleComponent } from './examples/longtext-key-value-list-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-key-value-list',
  templateUrl: 'docs-key-value-list.component.html',
  styleUrls: ['docs-key-value-list.component.scss'],
})
export class DocsKeyValueListComponent {
  examples = {
    default: DefaultKeyValueListExampleComponent,
    multicolumn: MulticolumnKeyValueListExampleComponent,
    longtext: LongtextKeyValueListExampleComponent,
  };
}
