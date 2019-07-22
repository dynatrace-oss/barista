import { NgModule } from '@angular/core';
import { DtTimelineChart } from './timeline-chart';
import {
  DtTimelineChartTimingMarker,
  DtTimelineChartKeyTimingMarker,
} from './timeline-chart-directives';
import { CommonModule } from '@angular/common';
import { DtLegendModule } from '../legend';
import { PortalModule } from '@angular/cdk/portal';

export const DT_TIMELINE_CHART_DIRECTIVES = [
  DtTimelineChart,
  DtTimelineChartTimingMarker,
  DtTimelineChartKeyTimingMarker,
];

@NgModule({
  exports: DT_TIMELINE_CHART_DIRECTIVES,
  imports: [CommonModule, DtLegendModule, PortalModule],
  declarations: DT_TIMELINE_CHART_DIRECTIVES,
})
export class DtTimelineChartModule {}
