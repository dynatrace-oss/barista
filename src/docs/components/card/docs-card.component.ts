import { Component } from '@angular/core';
import { DefaultCardExampleComponent } from './examples/default-card-example.component';
import { ContentOnlyCardExampleComponent } from './examples/contentonly-card-example.component';
import { TitleCardExampleComponent } from './examples/title-card-example.component';
import { SubtitleCardExampleComponent } from './examples/subtitle-card-example.component';
import { ActionButtonsCardExampleComponent } from './examples/action-buttons-card-example.component';
import { DarkThemeCardExampleComponent } from './examples/darktheme-card-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-card',
  templateUrl: './docs-card.component.html',
})
export class DocsCardComponent {

  examples = {
    default: DefaultCardExampleComponent,
    contentonly: ContentOnlyCardExampleComponent,
    title: TitleCardExampleComponent,
    subtitle: SubtitleCardExampleComponent,
    actions: ActionButtonsCardExampleComponent,
    dark: DarkThemeCardExampleComponent,
  };
}
