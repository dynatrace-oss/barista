import { Component, ViewChild } from '@angular/core';
import { HeaderRowPlaceholder } from '@angular/cdk/table';
import { DefaultTableExampleComponent } from './examples/table-default-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-table',
  templateUrl: './docs-table.component.html',
})
export class DocsTableComponent { examples = {
    default: DefaultTableExampleComponent,
  };
}
