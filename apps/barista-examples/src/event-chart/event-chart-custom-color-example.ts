import { Component } from '@angular/core';

@Component({
  selector: 'event-chart-demo',
  template: `
    <dt-event-chart>
      <dt-event-chart-event value="0" lane="xhr"></dt-event-chart-event>
      <dt-event-chart-event
        value="15"
        lane="xhr"
        color="error"
      ></dt-event-chart-event>
      <dt-event-chart-event
        value="25"
        lane="xhr"
        color="filtered"
      ></dt-event-chart-event>
      <dt-event-chart-event
        value="10"
        lane="user-event"
        color="conversion"
      ></dt-event-chart-event>
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
    </dt-event-chart>
  `,
})
export class EventChartCustomColorExample {}
