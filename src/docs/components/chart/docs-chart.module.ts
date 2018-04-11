import { NgModule } from '@angular/core';
import { DocsChartComponent } from './docs-chart.component';
import { UiModule } from '../../ui/ui.module';
import { ChartModule, DtThemingModule } from '@dynatrace/angular-components';
import { DEFAULT_VIEWPORT_RESIZER_PROVIDER } from '@dynatrace/angular-components/core';
import { ChartService } from './docs-chart.service';
import { VIEWPORT_RULER_PROVIDER } from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    UiModule,
    ChartModule,
    DtThemingModule,
  ],
  declarations: [
    DocsChartComponent,
  ],
  exports: [
    DocsChartComponent,
  ],
  providers: [
    ChartService,
    VIEWPORT_RULER_PROVIDER,
    DEFAULT_VIEWPORT_RESIZER_PROVIDER,
  ],
})
export class DocsChartModule {
}
