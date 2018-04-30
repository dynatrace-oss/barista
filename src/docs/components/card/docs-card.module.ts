import { NgModule } from '@angular/core';
import { DocsCardComponent } from './docs-card.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtCardModule, DtButtonModule, DtThemingModule, } from '@dynatrace/angular-components';
import { DefaultCardExampleComponent } from './examples/default-card-example.component';
import { ContentOnlyCardExampleComponent } from './examples/contentonly-card-example.component';
import { TitleCardExampleComponent } from './examples/title-card-example.component';
import { SubtitleCardExampleComponent } from './examples/subtitle-card-example.component';
import { ActionButtonsCardExampleComponent } from './examples/action-buttons-card-example.component';
import { DarkThemeCardExampleComponent } from './examples/darktheme-card-example.component';
import { IconCardExampleComponent } from './examples/icon-card-example.component';

const EXAMPLES = [
  DefaultCardExampleComponent,
  ContentOnlyCardExampleComponent,
  TitleCardExampleComponent,
  SubtitleCardExampleComponent,
  ActionButtonsCardExampleComponent,
  DarkThemeCardExampleComponent,
  IconCardExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtCardModule,
    DtButtonModule,
    DtThemingModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsCardComponent,
  ],
  exports: [
    DocsCardComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsCardModule {
}
