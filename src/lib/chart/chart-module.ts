import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DtLoadingDistractorModule } from '@dynatrace/angular-components/loading-distractor';
import { DtSelectionAreaModule } from '@dynatrace/angular-components/selection-area';
import { DtButtonModule } from '../button';
import { DtIconModule } from '../icon';
import { DtChart } from './chart';
import { DtChartHeatfield } from './heatfield/chart-heatfield';
import { DtChartRange } from './range/range';
import { DtChartSelectionAreaOrigin } from './selection-area.bak/chart-selection-area-origin';
import { DtChartSelectionAreaAction } from './selection-area/overlay-action';
import { DtChartSelectionArea } from './selection-area/selection-area';
import { DtChartTimestamp } from './timestamp/timestamp';
import { DtChartTooltip } from './tooltip/chart-tooltip';
import { DtFormattersModule } from '../formatters';

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
    DtFormattersModule,
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS, DtChartSelectionArea],
})
export class DtChartModule {}
