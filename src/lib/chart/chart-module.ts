import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DtLoadingDistractorModule } from '@dynatrace/angular-components/loading-distractor';
import { DtSelectionAreaModule } from '@dynatrace/angular-components/selection-area';
import { DtChart } from './chart';
import { DtChartHeatfield } from './heatfield/chart-heatfield';
import { DtChartRange } from './range/range';
import { DtChartSelectionAreaOrigin } from './selection-area.bak/chart-selection-area-origin';
import { DtChartTimestamp } from './timestamp/timestamp';
import { DtChartTooltip } from './tooltip/chart-tooltip';
import { DtChartSelectionArea } from './selection-area/selection-area';
import { DtChartSelectionAreaAction } from './selection-area/overlay-action';
import { DtIconModule } from '../icon';
import { DtButtonModule } from '../button';

/** components that should be declared and exported */
const COMPONENTS = [
  DtChart,
  DtChartHeatfield,
  DtChartRange,
  DtChartSelectionAreaOrigin,
  DtChartTimestamp,
  DtChartTooltip,
  DtChartSelectionAreaAction,
];

@NgModule({
  imports: [
    CommonModule,
    DtLoadingDistractorModule,
    OverlayModule,
    DtIconModule,
    DtButtonModule,
    DtSelectionAreaModule,
  ],
  exports: COMPONENTS,
  declarations: [
    ...COMPONENTS,
    DtChartSelectionArea,
  ],
})
export class DtChartModule {}
