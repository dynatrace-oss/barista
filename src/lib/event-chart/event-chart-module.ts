import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtLegendModule } from '@dynatrace/angular-components/legend';
import { DtOverlayModule } from '@dynatrace/angular-components/overlay';

import { DtEventChart } from './event-chart';
import {
  DtEventChartEvent,
  DtEventChartLane,
  DtEventChartLegendItem,
  DtEventChartOverlay,
} from './event-chart-directives';
import { DtEventChartLegend } from './event-chart-legend';

export const DT_EVENT_CHART_DIRECTIVES = [
  DtEventChart,
  DtEventChartEvent,
  DtEventChartLane,
  DtEventChartLegendItem,
  DtEventChartOverlay,
];

@NgModule({
  exports: DT_EVENT_CHART_DIRECTIVES,
  imports: [CommonModule, DtLegendModule, DtOverlayModule],
  declarations: [DtEventChartLegend, ...DT_EVENT_CHART_DIRECTIVES],
})
export class DtEventChartModule {}
