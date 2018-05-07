import { Component } from '@angular/core';
import { DefaultContextDialogExampleComponent } from './examples/default-context-dialog-example.component';
import { DarkContextDialogExampleComponent } from './examples/dark-context-dialog-example.component';
import { FocusContextDialogExampleComponent } from './examples/focus-context-dialog-example.component';
import { PrevFocusContextDialogExampleComponent } from './examples/previous-focus-context-dialog-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-context-dialog',
  templateUrl: './docs-context-dialog.component.html',
})
export class DocsContextDialogComponent {

  examples = {
    default: DefaultContextDialogExampleComponent,
    dark: DarkContextDialogExampleComponent,
    focus: FocusContextDialogExampleComponent,
    prevFocus: PrevFocusContextDialogExampleComponent,
  };
}
