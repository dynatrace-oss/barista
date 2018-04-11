import { Component } from '@angular/core';
import {ButtonToggleDefaultExampleComponent} from './examples/button-toggle-default-example.component';
import {ButtonToggleDisabledExampleComponent} from './examples/button-toggle-disabled-example.component';
import {ButtonToggleItemDisabledExampleComponent} from './examples/button-toggle-item-disabled-example.component';
import {ButtonToggleInteractiveExampleComponent} from './examples/button-toggle-interactive-example.component';
import {ButtonToggleErrorExampleComponent} from './examples/button-toggle-error-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-button-toggle',
  styleUrls: ['./docs-button-toggle.component.scss'],
  templateUrl: './docs-button-toggle.component.html',
})
export class DocsButtonToggleComponent {

  examples = {
    default: ButtonToggleDefaultExampleComponent,
    groupDisabled: ButtonToggleDisabledExampleComponent,
    itemDisabled: ButtonToggleItemDisabledExampleComponent,
    interactive: ButtonToggleInteractiveExampleComponent,
    error: ButtonToggleErrorExampleComponent
  };
}
