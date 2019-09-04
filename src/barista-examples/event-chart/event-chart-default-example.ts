import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'event-chart-demo',
  template: `
    <dt-event-chart>
      <dt-event-chart-event
        *ngFor="let event of events"
        [value]="event.value"
        [duration]="event.duration"
        [lane]="event.lane"
      >
        <ng-template dtEventChartOverlay>overlay content</ng-template>
      </dt-event-chart-event>

      <dt-event-chart-lane
        *ngFor="let lane of lanes"
        [name]="lane.name"
        [label]="lane.label"
        [color]="lane.color"
      ></dt-event-chart-lane>
      <dt-event-chart-legend-item
        *ngFor="let item of legendItems"
        [lanes]="item.lanes"
      >
        {{ item.label }}
      </dt-event-chart-legend-item>
    </dt-event-chart>
  `,
})
export class EventChartDefaultExample {
  events = [
    { value: 0, duration: 2964, lane: '0' },
    { value: 2965, lane: '0' },
    { value: 3055, lane: '1' },
    { value: 3080, lane: '0' },
    { value: 3323, lane: '2' },
    { value: 3428, lane: '1' },
    { value: 3437, lane: '0' },
  ];

  lanes = [
    { name: '0', label: 'User action', color: 'default' },
    { name: '1', label: 'User event', color: 'default' },
    { name: '2', label: 'Errors', color: 'error' },
  ];

  legendItems = [
    { label: 'User action or event', lanes: ['0', '1'] },
    { label: '2', lanes: ['2'] },
  ];
}
