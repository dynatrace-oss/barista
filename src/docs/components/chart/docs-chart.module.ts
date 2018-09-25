import { NgModule } from '@angular/core';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import {
  DtChartModule,
  DtButtonModule,
  DtThemingModule,
} from '@dynatrace/angular-components';
import { ChartDefaultExampleComponent } from './examples/chart-default-example.component';
import { ChartStreamExampleComponent } from './examples/chart-stream-example.component';
import { ChartOrderdColorsExampleComponent } from './examples/chart-ordered-colors-example.component';
import { ChartLoadingExampleComponent } from './examples/chart-loading-example.component';
import { ChartCategorizedExampleComponent } from './examples/chart-categorized-example.component';
import { ChartPieExampleComponent } from './examples/chart-pie-example.component';
import { ChartAreaRangeExampleComponent } from './examples/chart-arearange-example.component';
import {MicroChartExampleComponent} from './examples/microchart-example.component';

export const EXAMPLES = [
  ChartDefaultExampleComponent,
  ChartStreamExampleComponent,
  ChartOrderdColorsExampleComponent,
  ChartLoadingExampleComponent,
  ChartCategorizedExampleComponent,
  ChartPieExampleComponent,
  ChartAreaRangeExampleComponent,
  MicroChartExampleComponent,
];

@NgModule({
  imports: [
    UiModule,
    DtChartModule,
    DtThemingModule,
    DtButtonModule,
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
export class DocsChartModule {
}
