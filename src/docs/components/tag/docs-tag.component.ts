import { Component } from '@angular/core';
import { DefaultTagExampleComponent } from './examples/default-tag-example.component';
import {DisabledTagExampleComponent} from './examples/disabled-tag-example.component';
import {KeyTagExampleComponent} from './examples/key-tag-example.component';
import {InteractiveTagExampleComponent} from './examples/interactive-tag-example.component';
import {PlainInteractiveTagExampleComponent} from './examples/plaininteractive-tag-example.component';
import {RemovableTagExampleComponent} from './examples/removable-tag-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-tag',
  templateUrl: 'docs-tag.component.html',
})
export class DocsTagComponent {
  examples = {
    default: DefaultTagExampleComponent,
    disabled: DisabledTagExampleComponent,
    key: KeyTagExampleComponent,
    interactive: InteractiveTagExampleComponent,
    plaininteractive: PlainInteractiveTagExampleComponent,
    removable: RemovableTagExampleComponent,
  };
}
