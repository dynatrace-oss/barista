import { NgModule } from '@angular/core';
import { DocsChartComponent } from './docs-chart.component';
import { UiModule } from '../../ui/ui.module';
import { ChartModule } from '@dynatrace/angular-components/chart';
import { ChartService } from './docs-chart.service';

@NgModule({
  imports: [
    UiModule,
    ChartModule,
  ],
  declarations: [
    DocsChartComponent,
  ],
  exports: [
    DocsChartComponent,
  ],
  providers: [
    ChartService,
  ],
})
export class DocsChartModule {
}
