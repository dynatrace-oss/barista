import { NgModule } from '@angular/core';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import {
  DtMicroChartModule,
  DtButtonModule,
  DtThemingModule,
} from '@dynatrace/angular-components';
import { MicroChartDefaultExampleComponent } from './examples/micro-chart-default-example.component';
import { MicroChartColumnsExampleComponent } from './examples/micro-chart-columns-example.component';
import { MicroChartStreamExampleComponent } from './examples/micro-chart-stream-example.component';

export const EXAMPLES = [
  MicroChartColumnsExampleComponent,
  MicroChartDefaultExampleComponent,
  MicroChartStreamExampleComponent,
];

@NgModule({
  imports: [
    UiModule,
    DtThemingModule,
    DtButtonModule,
    DtMicroChartModule,
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
export class DocsMicroChartModule {
}
