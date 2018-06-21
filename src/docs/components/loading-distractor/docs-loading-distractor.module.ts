import { NgModule } from '@angular/core';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtLoadingDistractorModule } from '@dynatrace/angular-components';
import { DefaultLoadingDistractorExampleComponent } from './examples/loading-distractor-default-example';
import { SpinnerLoadingDistractorExampleComponent } from './examples/loading-distractor-spinner-example';

const EXAMPLES = [
  DefaultLoadingDistractorExampleComponent,
  SpinnerLoadingDistractorExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtLoadingDistractorModule,
  ],
  declarations: [
    ...EXAMPLES,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsLoadingDistractorModule {
}
