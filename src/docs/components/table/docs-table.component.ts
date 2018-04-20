import { Component, ViewChild } from '@angular/core';
import { HeaderRowPlaceholder } from '@angular/cdk/table';
import { DefaultTableExampleComponent } from './examples/table-default-example.component';
import { EmptyTableExampleComponent } from './examples/table-empty-state.component';

@Component({
  moduleId: module.id,
  selector: 'docs-table',
  templateUrl: './docs-table.component.html',
})
export class DocsTableComponent { examples = {
    default: DefaultTableExampleComponent,
    empty: EmptyTableExampleComponent,
  };
}
