import { NgModule } from '@angular/core';
import { DtChart } from './chart';
import { CommonModule } from '@angular/common';
import { DtLoadingDistractorModule } from '@dynatrace/angular-components/loading-distractor';
import { DtChartHeatfield } from './heatfield/chart-heatfield';
import { OverlayModule } from '@angular/cdk/overlay';
import { DtChartSelectionAreaOrigin } from './selection-area/chart-selection-area-origin';
import { DtSelectionAreaModule } from '@dynatrace/angular-components/selection-area';
import { DtChartTooltip } from './tooltip/chart-tooltip';
// import { DtChartSelectionArea } from './animations/chart-selection-area';
import { DtChartTimestamp } from './timestamp/timestamp';
import { DtChartRange } from './animations/range';

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
    DtChartTooltip,
    // DtChartSelectionArea,
    DtChartTimestamp,
    DtChartRange,
  ],
  declarations: [
    DtChart,
    DtChartHeatfield,
    DtChartSelectionAreaOrigin,
    DtChartTooltip,
    // DtChartSelectionArea,
    DtChartTimestamp,
    DtChartRange,
  ],
})
export class DtChartModule {}
