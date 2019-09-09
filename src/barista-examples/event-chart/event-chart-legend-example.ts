import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'event-chart-demo',
  template: `
    <dt-event-chart>
      <dt-event-chart-event value="0" lane="xhr"></dt-event-chart-event>
      <dt-event-chart-event
        value="15"
        lane="xhr"
        color="error"
      ></dt-event-chart-event>
      <dt-event-chart-event value="25" lane="xhr"></dt-event-chart-event>
      <dt-event-chart-event value="10" lane="user-event"></dt-event-chart-event>
      <dt-event-chart-event
        value="35"
        lane="xhr"
        duration="15"
      ></dt-event-chart-event>
      <dt-event-chart-event value="75" lane="user-event"></dt-event-chart-event>

      <dt-event-chart-lane name="xhr" label="XHR"></dt-event-chart-lane>
      <dt-event-chart-lane
        name="user-event"
        label="User event"
      ></dt-event-chart-lane>

      <dt-event-chart-legend-item [lanes]="['xhr', 'user-event']">
        Legend label for default events
      </dt-event-chart-legend-item>
      <dt-event-chart-legend-item [lanes]="['xhr', 'user-event']" color="error">
        Legend label for error events
      </dt-event-chart-legend-item>
      <dt-event-chart-legend-item [lanes]="['xhr', 'user-event']" hasDuration>
        Legend label for duration events
      </dt-event-chart-legend-item>
    </dt-event-chart>
  `,
})
export class EventChartLegendExample {}
