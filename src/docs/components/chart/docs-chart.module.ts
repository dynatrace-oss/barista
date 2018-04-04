import { NgModule } from '@angular/core';
import { DocsChartComponent } from './docs-chart.component';
import { UiModule } from '../../ui/ui.module';
import { ChartModule } from '@dynatrace/angular-components/chart';

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
})
export class DocsChartModule {
}
