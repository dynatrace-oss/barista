import { Component } from '@angular/core';

import { DtEventChartSelectedEvent } from '@dynatrace/barista-components/event-chart';

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-event-chart>
      <dt-event-chart-event
        *ngFor="let event of _events"
        [value]="event.value"
        [duration]="event.duration"
        [lane]="event.lane"
        [color]="event.color"
        (selected)="logSelected($event)"
        [data]="event.data"
      ></dt-event-chart-event>

      <dt-event-chart-lane
        name="xhr"
        label="XHR"
        pattern="true"
      ></dt-event-chart-lane>
      <dt-event-chart-lane
        *ngIf="_userEventsLaneEnabled"
        name="user-event"
        label="User event"
      ></dt-event-chart-lane>

      <dt-event-chart-legend-item [lanes]="['xhr', 'user-event']">
        This is the default legend
      </dt-event-chart-legend-item>
      <dt-event-chart-legend-item [lanes]="['xhr']" pattern>
        {{ _durationLabel }}
      </dt-event-chart-legend-item>
      <dt-event-chart-legend-item
        *ngIf="_errorLegendEnabled"
        [lanes]="['xhr', 'user-event']"
        color="error"
      >
        This is the error legend
      </dt-event-chart-legend-item>

      <ng-template dtEventChartOverlay let-tooltip>
        <div *ngFor="let t of tooltip">
          {{ t.data }}
        </div>
      </ng-template>
    </dt-event-chart>
  `,
})
export class EventChartDefaultExample {
  selected: DtEventChartSelectedEvent<number>;
  logSelected(selected: DtEventChartSelectedEvent<number>): void {
    this.selected = selected;
  }

  _userEventsLaneEnabled = true;

  _errorLegendEnabled = false;

  _durationLabel = 'This is the default duration legend';

  _events = [
    {
      value: 0,
      duration: 0,
      lane: 'xhr',
      color: 'default',
      data: 1,
    },
    {
      value: 15,
      duration: 0,
      lane: 'xhr',
      color: 'default',
      data: 2,
    },
    {
      value: 35,
      duration: 0,
      lane: 'xhr',
      color: 'default',
      data: 3,
    },
    {
      value: 45,
      duration: 0,
      lane: 'user-event',
      color: 'error',
      data: 4,
    },
    {
      value: 65,
      duration: 0,
      lane: 'user-event',
      color: 'conversion',
      data: 5,
    },
    {
      value: 80,
      duration: 20,
      lane: 'xhr',
      color: 'default',
      data: 6,
    },
    {
      value: 110,
      duration: 0,
      lane: 'xhr',
      color: 'default',
      data: 7,
    },
  ];
}
