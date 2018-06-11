import { Component } from '@angular/core';
import { DefaultShowMoreExampleComponent } from './examples/default-show-more-example.component';
import {DarkThemeShowMoreExampleComponent} from './examples/darktheme-show-more-example.component';
import {InteractiveShowMoreExampleComponent} from './examples/interactive-show-more-example.component';
import {NoTextShowMoreExampleComponent} from './examples/notext-show-more-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-show-more',
  templateUrl: 'docs-show-more.component.html',
})
export class DocsShowMoreComponent {
  examples = {
    default: DefaultShowMoreExampleComponent,
    notext: NoTextShowMoreExampleComponent,
    interactive: InteractiveShowMoreExampleComponent,
    darktheme: DarkThemeShowMoreExampleComponent,
  };
}
