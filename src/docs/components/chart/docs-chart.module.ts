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
import { ChartHeatfieldExampleComponent } from './examples/chart-heatfield-example.component';
import { ChartHeatfieldMultipleExampleComponent } from './examples/chart-heatfield-multiple-example.component';

export const EXAMPLES = [
  ChartDefaultExampleComponent,
  ChartStreamExampleComponent,
  ChartOrderdColorsExampleComponent,
  ChartLoadingExampleComponent,
  ChartCategorizedExampleComponent,
  ChartPieExampleComponent,
  ChartAreaRangeExampleComponent,
  ChartHeatfieldExampleComponent,
  ChartHeatfieldMultipleExampleComponent,
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
