import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtFormattersModule } from '@dynatrace/angular-components/formatters';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { DtLoadingDistractorModule } from '@dynatrace/angular-components/loading-distractor';
import { DtSelectionAreaModule } from '@dynatrace/angular-components/selection-area';
import { DtChart } from './chart';
import { DtChartHeatfield } from './heatfield/chart-heatfield';
import { DtChartRange } from './range/range';
import { DtChartSelectionAreaOrigin } from './selection-area-deprecated/chart-selection-area-origin';
import { DtChartSelectionAreaAction } from './selection-area/overlay-action';
import { DtChartSelectionArea } from './selection-area/selection-area';
import { DtChartTimestamp } from './timestamp/timestamp';
import { DtChartTooltip } from './tooltip/chart-tooltip';
import { A11yModule } from '@angular/cdk/a11y';

/** components that should be declared and exported */
const COMPONENTS = [
  DtChart,
  DtChartHeatfield,
  DtChartRange,
  // tslint:disable-next-line: deprecation
  DtChartSelectionAreaOrigin,
  DtChartTimestamp,
  DtChartTooltip,
  DtChartSelectionAreaAction,
];

@NgModule({
  imports: [
    CommonModule,
    DtLoadingDistractorModule,
    A11yModule,
    OverlayModule,
    DtIconModule,
    DtButtonModule,
    // tslint:disable-next-line: deprecation
    DtSelectionAreaModule,
    DtFormattersModule,
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS, DtChartSelectionArea],
})
export class DtChartModule {}
