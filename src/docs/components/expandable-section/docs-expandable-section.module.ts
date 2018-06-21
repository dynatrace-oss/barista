import { NgModule } from '@angular/core';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtButtonModule, DtExpandableSectionModule } from '@dynatrace/angular-components';
import {DefaultExpandableSectionExampleComponent} from './examples/expandable-section-default-example.component';
import {InteractiveExpandableSectionExampleComponent} from './examples/expandable-section-interactive-example.component';
import {OpenExpandableSectionExampleComponent} from './examples/expandable-section-open-example.component';
import {DisabledExpandableSectionExampleComponent} from './examples/expandable-section-disabled-example.component';

const EXAMPLES = [
  DefaultExpandableSectionExampleComponent,
  InteractiveExpandableSectionExampleComponent,
  OpenExpandableSectionExampleComponent,
  DisabledExpandableSectionExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtButtonModule,
    DtExpandableSectionModule,
  ],
  declarations: [
    ...EXAMPLES,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsExpandableSectionModule {
}
