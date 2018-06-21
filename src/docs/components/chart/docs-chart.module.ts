import { NgModule } from '@angular/core';
import { UiModule } from '../../ui/ui.module';
import {
  DtChartModule,
  DtButtonModule,
  DtThemingModule,
} from '@dynatrace/angular-components';
import { ChartService } from './examples/docs-chart.service';
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
    ...EXAMPLES,
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
