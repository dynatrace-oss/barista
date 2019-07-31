import { NgModule } from '@angular/core';
import { DtTimelineChart } from './timeline-chart';
import {
  DtTimelineChartTimingMarker,
  DtTimelineChartKeyTimingMarker,
  DtTimelineChartOverlayTitle,
  DtTimelineChartOverlayText,
} from './timeline-chart-directives';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { DtLegendModule } from '@dynatrace/angular-components/legend';
import { DtOverlayModule } from '@dynatrace/angular-components/overlay';

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
