import { NgModule } from '@angular/core';
import { DtTimelineChart } from './timeline-chart';
import {
  DtTimelineChartTimingMarker,
  DtTimelineChartKeyTimingMarker,
} from './timeline-chart-directives';
import { CommonModule } from '@angular/common';

export const DT_TIMELINE_CHART_DIRECTIVES = [
  DtTimelineChart,
  DtTimelineChartTimingMarker,
  DtTimelineChartKeyTimingMarker,
];

@NgModule({
  exports: DT_TIMELINE_CHART_DIRECTIVES,
  imports: [CommonModule],
  declarations: DT_TIMELINE_CHART_DIRECTIVES,
})
export class DtTimelineChartModule {}
