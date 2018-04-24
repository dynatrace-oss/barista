import { NgModule } from '@angular/core';
import { DocsChartComponent } from './docs-chart.component';
import { UiModule } from '../../ui/ui.module';
import { DtChartModule } from '@dynatrace/angular-components/chart';
import { DtThemingModule } from '@dynatrace/angular-components/theming';
import { DEFAULT_VIEWPORT_RESIZER_PROVIDER } from '@dynatrace/angular-components/core';
import { ChartService } from './docs-chart.service';
import { VIEWPORT_RULER_PROVIDER } from '@angular/cdk/scrolling';
import { DtButtonModule } from '@dynatrace/angular-components/button';
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
    VIEWPORT_RULER_PROVIDER,
    DEFAULT_VIEWPORT_RESIZER_PROVIDER,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsChartModule {
}
