import { NgModule } from '@angular/core';
import { DtChart } from './chart';
import { CommonModule } from '@angular/common';
import { DtLoadingDistractorModule } from '@dynatrace/angular-components/loading-distractor';
import { DtChartHeatfield } from './heatfield/chart-heatfield';
import { OverlayModule } from '@angular/cdk/overlay';
import { DtChartSelectionAreaOrigin } from './selection-area/chart-selection-area-origin';
import { DtSelectionAreaModule } from '@dynatrace/angular-components/selection-area';

@NgModule({
  imports: [
    CommonModule,
    DtLoadingDistractorModule,
    OverlayModule,
    DtSelectionAreaModule,
  ],
  exports: [
    DtChart,
    DtChartHeatfield,
    DtChartSelectionAreaOrigin,
  ],
  declarations: [
    DtChart,
    DtChartHeatfield,
    DtChartSelectionAreaOrigin,
  ],
})
export class DtChartModule { }
