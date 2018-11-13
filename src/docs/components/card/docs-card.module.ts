import { NgModule } from '@angular/core';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtCardModule, DtButtonModule, DtThemingModule, DtIconModule, } from '@dynatrace/angular-components';
import { DefaultCardExampleComponent } from './examples/default-card-example.component';
import { TitleCardExampleComponent } from './examples/title-card-example.component';
import { SubtitleCardExampleComponent } from './examples/subtitle-card-example.component';
import { ActionButtonsCardExampleComponent } from './examples/action-buttons-card-example.component';
import { DarkThemeCardExampleComponent } from './examples/darktheme-card-example.component';
import { IconCardExampleComponent } from './examples/icon-card-example.component';

export const EXAMPLES = [
  DefaultCardExampleComponent,
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
    DtIconModule,
  ],
  declarations: [
    ...EXAMPLES,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
  providers: [
    { provide: COMPONENT_EXAMPLES, useValue: EXAMPLES, multi: true },
  ],
})
export class DocsCardModule {
}
