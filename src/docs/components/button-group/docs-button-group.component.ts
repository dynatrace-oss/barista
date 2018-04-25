import { Component } from '@angular/core';
import {ButtonGroupDefaultExampleComponent} from './examples/button-group-default-example.component';
import {ButtonGroupDisabledExampleComponent} from './examples/button-group-disabled-example.component';
import {ButtonGroupItemDisabledExampleComponent} from './examples/button-group-item-disabled-example.component';
import {ButtonGroupInteractiveExampleComponent} from './examples/button-group-interactive-example.component';
import {ButtonGroupErrorExampleComponent} from './examples/button-group-error-example.component';
import {ButtonGroupDarkExampleComponent} from './examples/button-group-dark-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-button-group',
  templateUrl: './docs-button-group.component.html',
})
export class DocsButtonGroupComponent {

  examples = {
    default: ButtonGroupDefaultExampleComponent,
    groupDisabled: ButtonGroupDisabledExampleComponent,
    itemDisabled: ButtonGroupItemDisabledExampleComponent,
    interactive: ButtonGroupInteractiveExampleComponent,
    error: ButtonGroupErrorExampleComponent,
    dark: ButtonGroupDarkExampleComponent,
  };
}
