import { NgModule } from '@angular/core';
import { DocsProgressBarComponent } from './docs-progress-bar.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtProgressBarModule, DtIconModule, DtButtonGroupModule, DtButtonModule } from '@dynatrace/angular-components';
import { DefaultProgressBarExampleComponent } from './examples/default-progress-bar-example.component';
import { RightAlignedProgressBarExampleComponent } from './examples/right-aligned-progress-bar-example.component';
import { WithColorProgressBarExampleComponent } from './examples/with-color-progress-bar-example.component';
import { ChangeProgressBarExampleComponent } from './examples/change-progress-bar-example.component';

const EXAMPLES = [
  DefaultProgressBarExampleComponent,
  RightAlignedProgressBarExampleComponent,
  WithColorProgressBarExampleComponent,
  ChangeProgressBarExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtIconModule,
    DtButtonGroupModule,
    DtButtonModule,
    DtProgressBarModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsProgressBarComponent,
  ],
  exports: [
    DocsProgressBarComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsProgressBarModule {
}
