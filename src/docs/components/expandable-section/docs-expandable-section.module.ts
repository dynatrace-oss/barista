import { NgModule } from '@angular/core';
import { DocsExpandableSectionComponent } from './docs-expandable-section.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import {DtButtonModule} from '@dynatrace/angular-components/button';
import {DtExpandableSectionModule} from '@dynatrace/angular-components/expandable-section';
import {DefaultExpandableSectionExampleComponent} from './examples/expandable-section-default-example.component';

const EXAMPLES = [
  DefaultExpandableSectionExampleComponent,
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
    DocsExpandableSectionComponent,
  ],
  exports: [
    DocsExpandableSectionComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsExpandableSectionModule {
}
