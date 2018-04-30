import { Component } from '@angular/core';
import { DefaultContextDialogExampleComponent } from './examples/default-context-dialog-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-context-dialog',
  templateUrl: './docs-context-dialog.component.html',
})
export class DocsContextDialogComponent {

  examples = {
    default: DefaultContextDialogExampleComponent,
  };
}
