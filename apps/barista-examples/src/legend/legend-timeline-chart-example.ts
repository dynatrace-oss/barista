import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'legend-timeline-chart-example',
  template: `
    <dt-timeline-chart value="0.37" unit="s">
      <dt-timeline-chart-timing-marker value="0.02" identifier="R">
        Request start 0.02s
      </dt-timeline-chart-timing-marker>
      <dt-timeline-chart-timing-marker value="0.04" identifier="S">
        Speed index 0.04s
      </dt-timeline-chart-timing-marker>
      <dt-timeline-chart-timing-marker value="0.17" identifier="I">
        DOM interactive 0.17s
      </dt-timeline-chart-timing-marker>
      <dt-timeline-chart-timing-marker value="0.37" identifier="L">
        Load event start 0.37s
      </dt-timeline-chart-timing-marker>
    </dt-timeline-chart>
  `,
  styles: [
    `
      .dt-timeline-chart-legend-symbol {
        display: block;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        color: #fff;
        background: #525252;
        font-size: 10px;
        font-weight: bold;
        line-height: 16px;
        text-align: center;
      }
    `,
  ],
})
export class TimelineChartLegendExample {}
