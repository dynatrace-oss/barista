import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtLegendModule } from '@dynatrace/angular-components/legend';
import { DtOverlayModule } from '@dynatrace/angular-components/overlay';

import { DtTimelineChart } from './timeline-chart';
import {
  DtTimelineChartKeyTimingMarker,
  DtTimelineChartOverlayText,
  DtTimelineChartOverlayTitle,
  DtTimelineChartTimingMarker,
} from './timeline-chart-directives';

export const DT_TIMELINE_CHART_DIRECTIVES = [
  DtTimelineChart,
  DtTimelineChartTimingMarker,
  DtTimelineChartKeyTimingMarker,
  DtTimelineChartOverlayTitle,
  DtTimelineChartOverlayText,
];

@NgModule({
  exports: DT_TIMELINE_CHART_DIRECTIVES,
  imports: [CommonModule, DtLegendModule, PortalModule, DtOverlayModule],
  declarations: DT_TIMELINE_CHART_DIRECTIVES,
})
export class DtTimelineChartModule {}
