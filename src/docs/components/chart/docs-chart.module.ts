import { NgModule } from '@angular/core';
import { DocsChartComponent } from './docs-chart.component';
import { UiModule } from '../../ui/ui.module';
import {
  DtChartModule,
  DtButtonModule,
  DtThemingModule,
  DtDefaultViewportResizer,
} from '@dynatrace/angular-components';
import { ChartService } from './examples/docs-chart.service';
import { VIEWPORT_RULER_PROVIDER } from '@angular/cdk/scrolling';
import { ChartDefaultExampleComponent } from './examples/chart-default-example.component';
import { ChartStreamExampleComponent } from './examples/chart-stream-example.component';
import { ChartThemingExampleComponent } from './examples/chart-theming-example.component';
import { ChartLoadingExampleComponent } from './examples/chart-loading-example.component';

const EXAMPLES = [
  ChartDefaultExampleComponent,
  ChartStreamExampleComponent,
  ChartThemingExampleComponent,
  ChartLoadingExampleComponent,
];

@NgModule({
  imports: [
    UiModule,
    DtChartModule,
    DtThemingModule,
    DtButtonModule,
  ],
  declarations: [
    DocsChartComponent,
    ...EXAMPLES,
  ],
  exports: [
    DocsChartComponent,
  ],
  providers: [
    ChartService,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsChartModule {
}
