import { Component } from '@angular/core';
import {WarningAlertExampleComponent} from './examples/warning-alert-example.component';
import {ErrorAlertExampleComponent} from './examples/error-alert-example.component';
import {InteractiveAlertExampleComponent} from './examples/interactive-alert-example.component';
import {DarkAlertExampleComponent} from './examples/dark-alert-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-alert-component',
  templateUrl: 'docs-alert.component.html',
})
export class DocsAlertComponent {
  examples = {
    warning: WarningAlertExampleComponent,
    error: ErrorAlertExampleComponent,
    interactive: InteractiveAlertExampleComponent,
    dark: DarkAlertExampleComponent,
  };
}
