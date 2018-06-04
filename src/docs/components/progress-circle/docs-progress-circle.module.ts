import { NgModule } from '@angular/core';
import { DefaultProgressCircleExampleComponent } from './examples/default-progress-circle-example.component';
import { DocsProgressCircleComponent } from './docs-progress-circle.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtProgressCircleModule, DtIconModule } from '@dynatrace/angular-components';
import { WithIconProgressCircleExampleComponent } from './examples/with-icon-progress-circle-example.component';

const EXAMPLES = [
  DefaultProgressCircleExampleComponent,
  WithIconProgressCircleExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtIconModule,
    DtProgressCircleModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsProgressCircleComponent,
  ],
  exports: [
    DocsProgressCircleComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsProgressCircleModule {
}
