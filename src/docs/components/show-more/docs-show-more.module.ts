import { NgModule } from '@angular/core';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtShowMoreModule, DtThemingModule, DtButtonModule } from '@dynatrace/angular-components';
import { DefaultShowMoreExampleComponent } from './examples/default-show-more-example.component';
import {InteractiveShowMoreExampleComponent} from './examples/interactive-show-more-example.component';
import {NoTextShowMoreExampleComponent} from './examples/notext-show-more-example.component';
import {DarkThemeShowMoreExampleComponent} from './examples/darktheme-show-more-example.component';

const EXAMPLES = [
  DefaultShowMoreExampleComponent,
  InteractiveShowMoreExampleComponent,
  NoTextShowMoreExampleComponent,
  DarkThemeShowMoreExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtShowMoreModule,
    DtThemingModule,
    DtButtonModule,
  ],
  declarations: [
    ...EXAMPLES,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsShowMoreModule {
}
