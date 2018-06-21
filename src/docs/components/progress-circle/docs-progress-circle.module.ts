import { NgModule } from '@angular/core';
import { DefaultProgressCircleExampleComponent } from './examples/default-progress-circle-example.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtProgressCircleModule, DtIconModule, DtButtonGroupModule, DtButtonModule } from '@dynatrace/angular-components';
import { WithIconProgressCircleExampleComponent } from './examples/with-icon-progress-circle-example.component';
import { WithTextProgressCircleExampleComponent } from './examples/with-text-progress-circle-example.component';
import { WithColorProgressCircleExampleComponent } from './examples/with-color-progress-circle-example.component';
import { ChangeProgressCircleExampleComponent } from './examples/change-progress-circle-example.component';

const EXAMPLES = [
  DefaultProgressCircleExampleComponent,
  WithIconProgressCircleExampleComponent,
  WithTextProgressCircleExampleComponent,
  WithColorProgressCircleExampleComponent,
  ChangeProgressCircleExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtIconModule,
    DtButtonGroupModule,
    DtButtonModule,
    DtProgressCircleModule,
  ],
  declarations: [
    ...EXAMPLES,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsProgressCircleModule {
}
