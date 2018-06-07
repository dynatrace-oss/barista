import { Component } from '@angular/core';
import { DefaultPaginationExampleComponent } from './examples/default-pagination-example.component';
import {ManyPaginationExampleComponent} from './examples/many-pagination-example.component';
import {DarkThemePaginationExampleComponent} from './examples/darktheme-pagination-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-pagination',
  templateUrl: 'docs-pagination.component.html',
})
export class DocsPaginationComponent {
  examples = {
    default: DefaultPaginationExampleComponent,
    many: ManyPaginationExampleComponent,
    darktheme: DarkThemePaginationExampleComponent,
  };
}
